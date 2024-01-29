import { connect } from "@dagger.io/dagger"

connect(
    async (client) => {
        //Frontend build
        // '/peerplatform-fe'
        const frontendSource = client.host().directory("/peerplatform/peerplatform-fe", { exclude: ["node_modules/"] })
        const node = client.container().from("node:16")
        await node 
            .withDirectory(frontendSource, "/src", frontendSource)
            .withWorkdir("/src")
            .withExec(["npm", "install"])
            .withExec(["npm", "run", "build"])
            .directory("build/")

            let lintErrors = null;
        try {
        await runner.withExec(["npm", "run", "lint"]).sync();
        } catch (error) {
        if (error instanceof ExecError) {
            console.log("Linting errors found");
            lintErrors = error.stdout;
            await writeFile("./lint-report.txt", error.stdout);
        }
        }
        if (lintErrors) {
        console.log("Proceeding with the build despite lint errors.");
        }
        await runner.withExec(["npm", "run", "format"]).sync();
        const frontendImage = client.container.from("nginx:alpine")
        frontendImage
            .withCopy("/src/build", "/usr/share/nginx/html")
            .commit("frontend-image")
     },
    { LogOutput: process.stderr }
)