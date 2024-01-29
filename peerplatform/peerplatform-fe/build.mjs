import { connect, GraphQLRequestError } from "@dagger.io/dagger"
// import { loginToDockerHub } from "/loginToDockerHub"
import { execSync } from "child_process";
import dotenv from 'dotenv';

dotenv.config();
if (!process.env["DOCKER_USERNAME"] || !process.env["DOCKER_PASSWORD"]) {
   console.log('Docker username or password has not been set')
   process.exit()
}


async function loginToDockerHub(contextDir, client, dockerRepo) {
//    const dockerUsernameSecret = await client.setSecret("DOCKER_USERNAME", process.env.DOCKER_USERNAME);
//    const dockerPasswordSecret = await client.setSecret("DOCKER_PASSWORD", process.env.DOCKER_PASSWORD);
    const dockerUserName = process.env.DOCKER_USERNAME
    const dockerPassword = process.env.DOCKER_PASSWORD
   try {
       const imageRef = await contextDir
           .dockerBuild()
           .from("debian:buster")
           .withExec(["sh", "-c", "apt-get update && apt-get install -y docker.io"])
        //    .withSecretVariable("DOCKER_USERNAME", dockerUsernameSecret)
        //    .withSecretVariable("DOCKER_PASSWORD", dockerPasswordSecret)
        //    .withRegistryAuth("docker.io",process.env.DOCKER_USERNAME, process.env.DOCKER_PASSWORD)
        .withExec([
            "sh", "-c",
            `echo "${dockerPassword}" | docker login -u "${dockerUserName}" --password-stdin`
        ])
        .publish(dockerRepo)
           return imageRef
   } catch (error) {
       console.error("Error during Docker login:", error);
       throw new Error("Docker login failed");
   }
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
   await loginToDockerHub(contextDir, client, dockerRepo);
    //    try {
    //        await imageRef.publish(dockerRepo);
    //        console.log(`Published image to: ${dockerRepo}`);
    //    } catch (publishErr) {
    //         console.error("Error during the Docker publish:", publishErr);
    //         if (publishErr instanceof GraphQLRequestError) {
    //             console.error("GraphQL Request Error Details:", publishErr);
    //         } 
    //     if (publishErr.response) {
    //         console.error("HTTP Status Code:", publishErr.response.status);
    //         console.error("HTTP Headers:", publishErr.response.headers);
    //         console.error("HTTP Response Body:", publishErr.response.data);
    //     } else {
    //             console.error("Publish Error Details:", publishErr);
    //         }
    //     }
    // } catch (loginErr) {
    //     console.error("Error during the Docker login:", loginErr);
    //     if (loginErr.response) {
    //         console.error("HTTP Status Code:", loginErr.response.status);
    //         console.error("HTTP Headers:", loginErr.response.headers);
    //         console.error("HTTP Response Body:", loginErr.response.data);
    //     } else {
    //         console.error("Login Error Details:", loginErr);
    //     }
    // }
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

connect(
   async (client) => {
       const contextDir = client.host().directory('peerplatform/peerplatform-fe', { exclude: ["node_modules/"] });
       const backendContextDir = client.host().directory('peerplatform');
       // const node = client.container().from("node:16");
       // const runner = noderr
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



