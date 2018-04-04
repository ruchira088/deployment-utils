const { cli, parseArgs } = require("./commands")

const [,, ...args] = process.argv

cli(parseArgs(args))