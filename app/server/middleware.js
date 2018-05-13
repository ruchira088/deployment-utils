const httpStatusCodes = require("http-status-codes")
const { headers, config } = require("../constants")

const getAuthValues = request => {
    const authorizationHeader = request.get(headers.AUTHORIZATION)

    if (authorizationHeader != null) {
        const [ type ] = authorizationHeader.trim().split(" ")
        const token = authorizationHeader.trim().substring(type.length).trim()

        return Promise.resolve({ type, token })
    } else {
        return Promise.reject("Missing Authorization header")
    }
}

const auth = secretBearerToken => (request, response, next) =>
    getAuthValues(request)
        .then(({ type, token }) => {
            if (type === config.AUTHORIZATION_TYPE && token === secretBearerToken) {
                next()
            } else {
                return Promise.reject("Invalid Authorization header")
            }
        })
        .catch(error => {
            response.status(httpStatusCodes.UNAUTHORIZED).json({ error })
        })

module.exports = {
    auth
}