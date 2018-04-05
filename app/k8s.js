const mustache = require("mustache")
const R = require("ramda")
const fs = require("fs")
const path = require("path")
const util = require("util")
const {
    DEFAULT_ENCODING,
    K8S_TEMPLATES,
    DEFAULT_REPLICA_COUNT,
    ENV_VARIABLE_PREFIX,
    SECRET_PREFIX
} = require("./constants")

const base64Encode = string => Buffer.from(string).toString("base64")

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

const validateView = (requiredProps, view) => R.all(key => Object.keys(view).includes(key), requiredProps)

const extractValues = prefix => config =>
    Object.keys(config)
        .filter(key => key.startsWith(prefix))
        .reduce((object, key) =>
                Object.assign({}, object, { [key.substring(prefix.length)]: config[key] }),
            {}
        )

const extractEnvValues = extractValues(ENV_VARIABLE_PREFIX)

const extractSecrets = extractValues(SECRET_PREFIX)

const transformKeyValueObject =
    (object, fn = value => value) => Object.keys(object).map(key => ({ key, value: fn(object[key]) }))

const transformConfigValues =
    config => {
        const secrets = transformKeyValueObject(extractSecrets(config), base64Encode)
        const envValues = transformKeyValueObject(extractEnvValues(config))

        return Object.keys(config)
                .filter(key => !R.any(prefix => key.startsWith(prefix), [ENV_VARIABLE_PREFIX, SECRET_PREFIX]))
                .reduce(
                    (object, key) => Object.assign({}, object, { [key]: config[key] }),
                    { envValues, secrets }
                )
    }

const k8sConfig = async configs => {
    const renderedTemplates = await Promise.all(
        K8S_TEMPLATES.map(templateName =>
            renderTemplate(
                templateName,
                Object.assign({}, { replicaCount: DEFAULT_REPLICA_COUNT }, transformConfigValues(configs))
            )
        )
    )

    return renderedTemplates.join("\n---\n")
}

module.exports = {
    k8sConfig,
    extractEnvValues
}