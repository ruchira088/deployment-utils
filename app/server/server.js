const express = require("express")
const bodyParser = require("body-parser")
const httpStatusCodes = require("http-status-codes")
const http = require("http")
const path = require("path")
const { auth } = require("./middleware")
const { getEnvValueWithDefault, getEnvValue } = require("../utils")
const { env, defaults } = require("../constants")
const { getLatestDockerImageVersionTag } = require("../aws")
const { name, version } = require("../../package.json")

const httpPort = getEnvValueWithDefault(env.HTTP_PORT, defaults.HTTP_PORT)

const createApp = secretBearerToken =>
{
    const app = express()
    const authenticatedRoute = auth(secretBearerToken)

    app.get("/info", (request, response) => response.json({ name, version }))

    app.use(bodyParser.json())

    app.post("/k8s-config", authenticatedRoute, ({ body }, response) => response.json(body))

    app.get("/docker-image/:repository/version-tag", authenticatedRoute, ({ params }, response) =>
        getLatestDockerImageVersionTag(params.repository)
            .then(versionTag => response.json({ versionTag }))
    )

    app.use("/scripts", authenticatedRoute, express.static(path.join(__dirname, "../../scripts")))

    app.get("/*", (request, response) => {
        response.status(httpStatusCodes.NOT_FOUND).json({ error: `Resource NOT found at ${request.path}`})
    })

    return app
}

Promise.all([getEnvValue(env.SECRET_BEARER_TOKEN)])
    .then(([ secretBearerToken ]) =>
        http.createServer(createApp(secretBearerToken))
            .listen(httpPort, () => console.log(`Server is listening on port ${httpPort}...`))
    )
    .catch(console.error)
