import { connect, GraphQLRequestError, ExecError } from "@dagger.io/dagger"
import { execSync } from "child_process";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const scriptUrl = import.meta.url;
const scriptDir = path.dirname(fileURLToPath(scriptUrl));


dotenv.config();
if (!process.env["DOCKER_USERNAME"] || !process.env["DOCKER_PASSWORD"]) {
   console.log('Docker username or password has not been set')
   process.exit()
}


async function loginToDockerHub(contextDir, client) {
   const dockerUsernameSecret = await client.setSecret("DOCKER_USERNAME", process.env.DOCKER_USERNAME);
   const dockerPasswordSecret = await client.setSecret("DOCKER_PASSWORD", process.env.DOCKER_PASSWORD);
   try {
       const imageRef = await contextDir
           .dockerBuild()
           .from("debian:buster")
           .withExec(["sh", "-c", "apt-get update && apt-get install -y docker.io"])
           .withSecretVariable("DOCKER_USERNAME", dockerUsernameSecret)
           .withSecretVariable("DOCKER_PASSWORD", dockerPasswordSecret)
        return imageRef;
    } catch (error) {
        console.error("Error during Docker operation:", error);
        if (error.message.includes('failed to fetch oauth token')) {
            console.error("OAuth token fetching failed. Detailed error: ", error);
        }
        throw new Error("Docker operation failed");
    }
};

async function dockerizeApp (contextDir, client, repo, environment) {
   const gitCommitHash = execSync("git rev-parse HEAD").toString().trim();
   let tag;
   let oldTag;
   if (environment === "dev") {
       tag = `${gitCommitHash}-dev`;
       await buildAndPublishDockerImage(contextDir, client, repo, tag);
   } else if (environment === "staging") {
        oldTag = `${gitCommitHash}-dev`
        tag = `${gitCommitHash}-staging`;
        await repullRetagRepublishImage(repo, oldTag, tag);
   }
    else {
       const oldTag = `${gitCommitHash}-staging`;
       tag = `${gitCommitHash}-${environment}`;
       await repullRetagRepublishImage(repo, oldTag, tag);
   }
}

async function buildAndPublishDockerImage(contextDir, client, repo, tag) {
    const dockerRepo = `${repo}:${tag}`;
    const imageRef = await loginToDockerHub(contextDir, client);
    try {
        await imageRef.publish(dockerRepo);
        console.log(`Published image to: ${dockerRepo}`);
    } catch (publishErr) {
        console.error("Error during the Docker publish:", publishErr);
        if (publishErr instanceof GraphQLRequestError) {
            console.error("GraphQL Request Error Details:", publishErr);
            if (publishErr.cause) {
                console.error("Original Error:", publishErr.cause);
            }        
        } 
        if (publishErr.response) {
            console.error("HTTP Status Code:", publishErr.response.status);
            console.error("HTTP Headers:", publishErr.response.headers);
            console.error("HTTP Response Body:", publishErr.response.data);
        } else {
            console.error("Publish Error Details:", publishErr);
        }
    }
} 

async function repullRetagRepublishImage(repo, oldTag, newTag) {
   try {
        const pullResult = execSync(`docker pull ${repo}:${oldTag}`, { stdio: 'pipe' }).toString();
        console.log(`Pull result for ${repo}:${oldTag}:`, pullResult);
        execSync(`docker tag ${repo}:${oldTag} ${repo}:${newTag}`);
       execSync(`docker push ${repo}:${newTag}`);
   } catch (err) {
       console.error("Error during image re-tagging:", err);
   }
}

connect(
   async (client) => {
    const frontendContextDir = path.join(scriptDir, '../peerplatform-fe');
    const backendContext = path.join(scriptDir, '../');
    const contextDir = client.host().directory(frontendContextDir, { exclude: ["node_modules/"] });
    const backendContextDir = client.host().directory(backendContext);
    const environment = process.env.ENVIRONMENT || "dev"; 
    const node = client.container().from("node:16");
    const runner =  node
        .withDirectory("/app", contextDir)
        .withWorkdir("/app")
        .withExec(["npm", "install", "--legacy-peer-deps"])

    if(environment === "dev") {
        let lintErrors = null;
        try {
                await runner.withExec(["npm", "run", "lint"]).sync();
        } catch (error) {
            if(error instanceof ExecError) {
                console.log("Linting errors found");
                lintErrors = error.stdout;
            }
        }
        if (lintErrors) {
            console.log("Proceeding with the build despite lint errors.");
        }  
        await runner.withExec(["npm", "run", "format"]).sync();
    }

    await runner.withExec(["npm", "test", "--", "--watchAll=false"]).sync();

    let feRepo = "emms21/interviewsageai"
    let beRepo = "emms21/interviewsageaibe"
    try {
        await dockerizeApp(contextDir, client, feRepo, environment)
        await dockerizeApp(backendContextDir, client, beRepo, environment)
    } catch (err) {
        console.error("Error during the Docker build and publish:", err);
    }
   },
   { LogOutput: process.stderr }
);



