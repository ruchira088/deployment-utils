const mustache = require("mustache")
const R = require("ramda")
const fs = require("fs")
const path = require("path")
const util = require("util")
const { DEFAULT_ENCODING } = require("./constants")

const getTemplatePath = templateName => path.resolve(__dirname, "../templates", `${templateName}.yaml`)

const readFile = path => util.promisify(fs.readFile)(path, DEFAULT_ENCODING)

const getTemplate = templateName => readFile(getTemplatePath(templateName))

const renderTemplate = async (templateName, view) => {
    const variables = await templateVariables(templateName)

    if (validateView(variables, view)) {
        const contents = await getTemplate(templateName)
        return mustache.render(contents, view)
    } else {
        return missingKeys(variables, view)
    }
}

const templateVariables = async templateName => {
    const contents = await getTemplate(templateName)

    return R.uniq(
        mustache.parse(contents)
            .filter(values => R.head(values) === "name")
            .map(([, name]) => name)
    )
}

const missingKeys = (variables, view) =>
    Promise.reject(`Missing keys from the view: ${R.difference(variables, Object.keys(view)).join(", ")}`)

const validateView = (keys, view) => R.all(key => keys.includes(key), Object.keys(view))

renderTemplate("service", { name: "john", containerPort: 80 })
    .then(console.log)
    .catch(console.error)