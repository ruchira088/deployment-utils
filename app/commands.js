const { k8sConfig } = require("./k8s")
const { getLatestDockerImageVersionTag } = require("./aws")

module.exports = [
    {
        commandName: "k8s-config",
        fn: k8sConfig
    },
    {
        commandName: "docker-image-version-tag",
        fn: ({ repositoryName }) => {
            if (repositoryName !== undefined) {
                return getLatestDockerImageVersionTag(repositoryName)
            } else {
                return Promise.reject("\"repositoryName\" is required to be passed via the CLI.")
            }
        }
    }
]