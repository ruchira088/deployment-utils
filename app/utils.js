const getEnvValue = name => {
    const value = process.env[name]

    if (value != null) {
        return Promise.resolve(value)
    } else {
        return Promise.reject(`${name} is NOT defined as an environment variable.`)
    }
}

module.exports = {
    getEnvValue
}