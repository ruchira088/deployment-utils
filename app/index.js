const mustache = require("mustache")
const fs = require("fs")
const { KEY_PREFIX } = require("./constants")

const [,, ...args] = process.argv

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

module.exports = { parseArgs }