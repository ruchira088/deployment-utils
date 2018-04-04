const { KEY_PREFIX } = require("./constants")
const commands = require("./commands")

const parseArgs = args =>
    args.reduce(({ output, object = {} }, arg) => {
        const [key, value] = arg.split("=")

        if (value != null) {
            return { output: Object.assign({}, output, { [key]: value }) }
        } else if (arg.startsWith(KEY_PREFIX)) {
            return {
                output,
                object: { key: arg.substring(KEY_PREFIX.length) }
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

const [,, ...args] = process.argv

cli(parseArgs(args))

module.exports = { parseArgs }