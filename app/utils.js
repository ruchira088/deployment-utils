const getEnvValue = 
	name => 
		(process.env[name] != null) ? 
			Promise.resolve(process.env[name]) : 
			Promise.reject(`${name} is NOT defined as an environment variable.`)
  

const getEnvValueWithDefault = 
	(name, defaultValue) => (process.env[name] != null) ? process.env[name] : defaultValue

module.exports = {
    getEnvValue,
    getEnvValueWithDefault
}