const express = require("express")
const bodyParser = require("body-parser")
const httpStatusCodes = require("http-status-codes")
const http = require("http")
const path = require("path")
const { getEnvValueWithDefault, getEnvValue } = require("../utils")
const { env, defaults, headers, config } = require("../constants")
const { getLatestDockerImageVersionTag } = require("../aws")
const { k8sConfig } = require("../k8s")
const { name, version } = require("../../package.json")

const httpPort = getEnvValueWithDefault(env.HTTP_PORT, defaults.HTTP_PORT)

const app = express()

app.get("/info", (request, response) => response.json({ name, version }))

const getAuthValues = request => {
    const authorizationHeader = request.get(headers.AUTHORIZATION)

    if (authorizationHeader != null) {
        const [ type ] = authorizationHeader.trim().split(" ")
        const token =authorizationHeader.trim().substring(type.length).trim()

        return Promise.resolve({ type, token })
    } else {
        return Promise.reject("Missing Authorization header")
    }
}

const verifyRequiredEnvValues = (...args) =>
    Promise.all(args.map(getEnvValue))

// app.use((request, response, next) =>
//     Promise.all([getEnvValue(env.SECRET_BEARER_TOKEN), getAuthValues(request)])
//         .then(([ secretBearerToken, { type, token }]) => {
//             if (type === config.authorizationType && token === secretBearerToken) {
//                 next()
//             } else {
//                 response.status(httpStatusCodes.UNAUTHORIZED).json({})
//             }
//         }))

app.use(bodyParser.json())

app.post("/k8s-config", ({ body }, response) => response.json(body))

app.get("/docker-image/:repository/version-tag", ({ params }, response) =>
    getLatestDockerImageVersionTag(params.repository)
        .then(versionTag => response.json({ versionTag }))
)

app.use("/scripts", express.static(path.join(__dirname, "../../scripts")))

verifyRequiredEnvValues(env.SECRET_BEARER_TOKEN)
    .then(() =>
        http.createServer(app)
            .listen(httpPort, () => console.log(`Server is listening on port ${httpPort}...`))
    )
    .catch(console.error)
