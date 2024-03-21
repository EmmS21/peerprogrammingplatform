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
        return  await (
            dag.container()
            .from_("node:16")
            # .from_("alpine:latest")
            .with_mounted_directory("/app", src)
            .with_workdir("/app")
            .with_exec(["npm", "ci", "--legacy-peer-deps"])
            # .with_exec(["sh", "-c", "ls -la"])
            # .with_exec(["npm", "install", "--legacy-peer-deps"])
            .with_exec(["npm", "run", "hello"])
        )
