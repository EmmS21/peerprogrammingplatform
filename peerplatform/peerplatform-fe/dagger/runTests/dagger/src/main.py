"""A generated module for RunTests functions

This module has been generated via dagger init and serves as a reference to
basic module structure as you get started with Dagger.

Two functions have been pre-created. You can modify, delete, or add to them,
as needed. They demonstrate usage of arguments and return types using simple
echo and grep commands. The functions can be called from the dagger CLI or
from one of the SDKs.

The first line in this comment block is a short description line and the
rest is a long description with more detail on the module's purpose or usage,
if appropriate. All modules should have a short description.
"""

import dagger
from dagger import dag, function, object_type, Directory, Container


@object_type
class RunTests:
    @function
    async def hello_world(self, src: dagger.Directory, op: str) -> str:
        frontendContextDir = '../../'
        # contextDir = await Directory.from_local_path(frontendContextDir)
        # Loading the directory as a dagger module
        # contextDir = Directory(frontendContextDir)
        # node_container = Container().from_image("node:16")
        node =  await (
            dag.container()
            .from_("node:16")
            # .from("alpine:latest")
            .with_mounted_directory("/app", src)
            # .with_workdir("/app")
            # .with_exec(["sh", "-c", "ls -la"])
            .with_exec(["npm", "install", "--legacy-peer-deps"])
            # .with_exec(["npm", "run", "build"])
            # .with_exec(["npm", "run", "hello"])
        )
        # node_container = node_container.mount_directory("/app", contextDir)
        # node_container.workdir("/app")
        # await node_container.exec(["npm", "install", "--legacy-peer-deps"])
        # return "Environment setup completed."

        # await node 
        #     .withDirectory(frontendSource, "/src", frontendSource)
        #     .withWorkdir("/src")
        #     .withExec(["npm", "install"])
        #     .withExec(["npm", "run", "build"])
        #     .directory("build/")

        #     let lintErrors = null;
        # try {


#    async (client) => {
#     const frontendContextDir = path.join(scriptDir, '../peerplatform-fe');
#     const backendContext = path.join(scriptDir, '../');
#     const contextDir = client.host().directory(frontendContextDir, { exclude: ["node_modules/"] });
#     const backendContextDir = client.host().directory(backendContext);
#     const environment = process.env.ENVIRONMENT || "dev"; 
#     const node = client.container().from("node:16");
#     const runner =  node
#         .withDirectory("/app", contextDir)
#         .withWorkdir("/app")
#         .withExec(["npm", "install", "--legacy-peer-deps"])

#     if(environment === "dev") {
#         let lintErrors = null;
#         try {
#                 await runner.withExec(["npm", "run", "lint"]).sync();
#         } catch (error) {
#             if(error instanceof ExecError) {
#                 console.log("Linting errors found");
#                 lintErrors = error.stdout;
#             }
#         }
#         if (lintErrors) {
#             console.log("Proceeding with the build despite lint errors.");
#         }  
#         await runner.withExec(["npm", "run", "format"]).sync();
#     }

#     await runner.withExec(["npm", "test", "--", "--watchAll=false"]).sync();


    # def container_echo(self, string_arg: str) -> dagger.Container:
    #     """Returns a container that echoes whatever string argument is provided"""
    #     return dag.container().from_("alpine:latest").with_exec(["echo", string_arg])
    
    # def build_echo(self, string_arg: str) -> dagger.Container:
    #     """Returns a container that echoes whatever string argument is provided"""
    #     return dag.container().from_("alpine:latest").with_exec(["echo", string_arg + "second time"])


    # @function
    # async def grep_dir(self, directory_arg: dagger.Directory, pattern: str) -> str:
    #     """Returns lines that match a pattern in the files of the provided Directory"""
    #     return await (
    #         dag.container()
    #         .from_("alpine:latest")
    #         .with_mounted_directory("/mnt", directory_arg)
    #         .with_workdir("/mnt")
    #         .with_exec(["grep", "-R", pattern, "."])
    #         .stdout()
    #     )


    # async def build_and_test(context: Directory) -> str:
    #     """
    #     Builds a Docker image from the provided context directory and runs unit tests.
    #     """
    #     image = await context.dockerBuild(
    #         file="Dockerfile",
    #         context=".",
    #         buildArgs={"NODE_VERSION": "16"}
    #     )

    #     # Assuming a mechanism to run `npm test` within the Docker container and return output
    #     test_output = await image.run(["npm", "test", "--", "--watchAll=false"])

    #     return test_output