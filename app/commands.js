const fs = require("fs")
const util = require("util")
const path = require("path")
const { k8sConfig } = require("./k8s")
const { getLatestDockerImageVersionTag } = require("./aws")
const { defaults, prefixes, config } = require("./constants")
const { name, version } = require("../package")

const commands = [
    {
        commandName: "k8s-config",
        fn: ({ output = defaults.K8S_OUTPUT_FILE, ...config }) =>
                k8sConfig(config).then(writeToOutputFile(output))
    },
    {
        commandName: "docker-image-version-tag",
        fn: ({ output = defaults.DOCKER_VERSION_FILE, repositoryName }) => {
            if (repositoryName !== undefined) {
                return getLatestDockerImageVersionTag(repositoryName).then(writeToOutputFile(output))
            } else {
                return Promise.reject("\"repositoryName\" is required to be passed via the CLI.")
            }
        }
    },
    {
        commandName: "version",
        fn: () => Promise.resolve({ name, version })
    }
]

const writeToOutputFile =
    fileName => text =>
        util.promisify(fs.writeFile)(path.resolve(__dirname, "../output", fileName), text, config.ENCODING)
            .then(() => "Success")

const parseArgs = args =>
    args.reduce(({ output, object = {} }, arg) => {
        const [key, value] = arg.split("=")

        if (value != null) {
            return { output: Object.assign({}, output, { [key]: value }) }
        } else if (arg.startsWith(prefixes.KEY)) {
            return {
                output,
                object: { key: arg.substring(prefixes.KEY.length) }
            }
        } else {
            return { output: Object.assign({}, output, { [object.key]: arg }) }
        }

    },  { output: {} }).output


const cli = ({ command: name, ...args }) => {
    const command = commands.find(({ commandName }) => commandName.toLowerCase() === name.toLowerCase())

    if (command !== undefined) {
        command.fn(args)
            .then(result => {
                console.log(result)
                process.exit(0)
            })
            .catch(error => {
                console.error(error)
                process.exit(1)
            })
    } else {
        console.error(`Unsupported command: ${name}`)
        process.exit(1)
    }
}

module.exports = { parseArgs, cli }