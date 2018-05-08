const AWS = require("aws-sdk")
const R = require("ramda")
const { getEnvValueWithDefault } = require("./utils")
const { defaults, env, prefixes } = require("./constants")

const ecr = new AWS.ECR({ region: getEnvValueWithDefault(env.REGION, defaults.REGION) })

const getHighestVersionTag =
    tags =>
        R.last(
            R.sortBy(
                version => version,
                tags
                    .filter(tag => tag.startsWith(prefixes.VERSION_TAG))
                    .map(R.compose(Number, tag => tag.substring(prefixes.VERSION_TAG.length)))
            )
        )

const getLatestDockerImageVersionTag = async repositoryName => {
    const { imageDetails } = await ecr.describeImages({ repositoryName }).promise()
    const dockerImageTags = imageDetails.reduce((tags, { imageTags = [] }) => tags.concat(imageTags), [])

    return getHighestVersionTag(dockerImageTags) || 0
}

module.exports = {
    getHighestVersionTag,
    getLatestDockerImageVersionTag
}