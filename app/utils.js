const getEnvValue = 
	name => 
		(process.env[name] != null) ? 
			Promise.resolve(process.env[name]) : 
			Promise.reject(`${name} is NOT defined as an environment variable.`)
  

const getEnvValueWithDefault = 
	(name, defaultValue) => (process.env[name] != null) ? process.env[name] : defaultValue

const trimObject = object =>
	Object.keys(object)
		.filter(key => object[key] != undefined)
		.reduce((result, key) => Object.assign({}, result, { [key]: object[key] }), {})

const map = (f, value) => value != null ? f(value) : value

module.exports = {
    getEnvValue,
    getEnvValueWithDefault,
	trimObject,
	map
}