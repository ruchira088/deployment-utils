const mustache = require("mustache")
const R = require("ramda")
const fs = require("fs")
const path = require("path")
const util = require("util")
const {
    defaults,
    config,
    prefixes,
    K8S_TEMPLATES
} = require("./constants")
const { map, trimObject } = require("./utils")

const base64Encode = string => Buffer.from(string).toString("base64")

const getTemplatePath = templateName => path.resolve(__dirname, "../templates", `${templateName}.yaml`)

const readFile = path => util.promisify(fs.readFile)(path, config.ENCODING)

const getTemplate = templateName => readFile(getTemplatePath(templateName))

const derivedViews = ({ host }) =>
    ({ tlsSecretName: map(value => `${dotCaseToKebabCase(value)}-tls`, host) })

const dotCaseToKebabCase = string => string.replace(/\./g, "-")

const renderTemplate = async (templateName, view) => {
    const variables = await templateVariables(templateName)
    const completeView = Object.assign({}, trimObject(derivedViews(view)), view)

    if (validateView(variables, completeView)) {
        const contents = await getTemplate(templateName)
        return mustache.render(contents, completeView)
    } else {
        return missingKeys(variables, completeView)
    }
}

const templateVariables = async templateName => {
    const contents = await getTemplate(templateName)

    return R.uniq(
        mustache.parse(contents)
            .filter(values => ["name", "&"].includes(R.head(values)))
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

const extractEnvValues = extractValues(prefixes.ENV_VARIABLE)

const extractSecrets = extractValues(prefixes.SECRET)

const transformKeyValueObject =
    (object, fn = value => value) => Object.keys(object).map(key => ({ key, value: fn(object[key]) }))

const transformConfigValues =
    config => {
        const secrets = transformKeyValueObject(extractSecrets(config), base64Encode)
        const envValues = transformKeyValueObject(extractEnvValues(config))

        return Object.keys(config)
                .filter(key => !R.any(prefix => key.startsWith(prefix), [prefixes.ENV_VARIABLE, prefixes.SECRET]))
                .reduce(
                    (object, key) => Object.assign({}, object, { [key]: config[key] }),
                    { envValues, secrets }
                )
    }

const k8sConfig = async configs => {
    const [ ingress, ...k8s ] = await Promise.all(
        K8S_TEMPLATES.map(templateName =>
            renderTemplate(
                templateName,
                Object.assign({}, { replicaCount: defaults.REPLICA_COUNT }, transformConfigValues(configs))
            )
        )
    )

    return { ingress, k8s: k8s.join("\n---\n") }
}

module.exports = {
    k8sConfig,
    extractEnvValues
}