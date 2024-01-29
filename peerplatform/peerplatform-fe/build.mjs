import { connect } from "@dagger.io/dagger"
// import { loginToDockerHub } from "/loginToDockerHub"
import { execSync } from "child_process";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path';

dotenv.config();
if (!process.env["DOCKER_USERNAME"] || !process.env["DOCKER_PASSWORD"]) {
    console.log('Docker username or password has not been set')
    process.exit()
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function loginToDockerHub(contextDir, client) {
    const dockerUsernameSecret = await client.setSecret("DOCKER_USERNAME", process.env.DOCKER_USERNAME);
    const dockerPasswordSecret = await client.setSecret("DOCKER_PASSWORD", process.env.DOCKER_PASSWORD);
    const imageRef = await contextDir
        .dockerBuild()
        .from("debian:buster") 
        .withExec(["sh", "-c", "apt-get update && apt-get install -y docker.io"])
        .withSecretVariable("DOCKER_USERNAME", dockerUsernameSecret)
        .withSecretVariable("DOCKER_PASSWORD", dockerPasswordSecret)
        .withExec([
            "sh", "-c",
            `echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin`
        ])
        return imageRef
};

async function dockerizeApp (contextDir, client, repo, environment) {
    const gitCommitHash = execSync("git rev-parse HEAD").toString().trim();
    let tag;
    if (environment === "dev") {
        tag = `${gitCommitHash}-dev`;
        await buildAndPublishDockerImage(contextDir, client, repo, tag);
    } else {
        const oldTag = `${gitCommitHash}-dev`;
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
    }
}

async function repullRetagRepublishImage(repo, oldTag, newTag) {
    try {
        execSync(`docker pull ${repo}:${oldTag}`);
        execSync(`docker tag ${repo}:${oldTag} ${repo}:${newTag}`);
        execSync(`docker push ${repo}:${newTag}`);
        console.log(`Re-tagged and pushed image from ${repo}:${oldTag} to ${repo}:${newTag}`);
    } catch (err) {
        console.error("Error during image re-tagging:", err);
    }
}



// async function dockerizeApp (contextDir, environment, client, repo) {
//     const gitCommitHash = execSync("git rev-parse HEAD").toString().trim();
//     let tag = `${gitCommitHash}-${environment}`;
//     const dockerRepo = `${repo}:${tag}`;
//     try {
//         const imageRef = await loginToDockerHub(contextDir, client);
//         try {
//             await imageRef.publish(dockerRepo);
//             console.log(`Published image to: ${dockerRepo}`);
//         } catch (publishErr) {
//             console.error("Error during the Docker publish:", publishErr);
//             if (publishErr.response) {
//                 console.error("HTTP Status Code:", publishErr.response.status);
//                 console.error("HTTP Headers:", publishErr.response.headers);
//                 console.error("HTTP Response Body:", publishErr.response.data);
//             } else {
//                 console.error("Publish Error Details:", publishErr);
//             }
//         }
//     } catch (loginErr) {
//         console.error("Error during the Docker login:", loginErr);
//         if (loginErr.response) {
//             console.error("HTTP Status Code:", loginErr.response.status);
//             console.error("HTTP Headers:", loginErr.response.headers);
//             console.error("HTTP Response Body:", loginErr.response.data);
//         } else {
//             console.error("Login Error Details:", loginErr);
//         }
//     }
// }


connect(
    async (client) => {
        const contextDir = client.host().directory(".", { exclude: ["node_modules/"] });  
        const backendContextDir = client.host().directory(join(__dirname, '../'));
        // const node = client.container().from("node:16");
        // const runner = node
        //   .withDirectory("/src", contextDir)
        //   .withWorkdir("/src")
        //   .withExec(["npm", "install", "--legacy-peer-deps"]);
          
        // await runner.withExec(["npm", "run", "format"]).sync();
        // await runner.withExec(["npm", "test", "--", "--watchAll=false"]).sync();
        const environment = process.env.ENVIRONMENT || "dev"; // Determine the stage
        //build frontend image
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