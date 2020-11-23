# Service Fabric Projects Needs A node.exe

For you to link a front-end UI to a MS Service Fabric project, unfortunately the `node.exe` actually needs to be in the code repository.

We don't want to check-in such a large file in this template, so you simply need to [download a Node executable](https://nodejs.org/en/download/) and place it in this folder.

Do _not_ place this at the root of the UI, as it'll interfere with `npm install` or other NPM scripts (forcing the local version to be used rather than the globally installed Node). And make sure the `start.bat` refers to it.
