const AWS = require("aws-sdk")
const R = require("ramda")
const { getEnvValueWithDefault } = require("./utils")
const { DEFAULT_REGION, ENV_REGION, VERSION_TAG_PREFIX } = require("./constants")

const ecr = new AWS.ECR({ region: getEnvValueWithDefault(ENV_REGION, DEFAULT_REGION) })

const getHighestVersionTag =
    tags =>
        R.last(
            R.sortBy(
                version => version,
                tags
                    .filter(tag => tag.startsWith(VERSION_TAG_PREFIX))
                    .map(R.compose(Number, tag => tag.substring(VERSION_TAG_PREFIX.length)))
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