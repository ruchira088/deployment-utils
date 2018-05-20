module.exports = {
    K8S_TEMPLATES: ["deployment", "service", "ingress", "configMap", "secrets"],
	prefixes: {
		KEY: "--",
		VERSION_TAG: "v",
		ENV_VARIABLE: "ENV_",
		SECRET: "SECRET_"
	},
	config: {
    	ENCODING: "utf-8"
	},
	defaults: {
		REGION: "ap-southeast-2",
        REPLICA_COUNT: 1,
		DOCKER_VERSION_FILE: "docker-version.txt",
        K8S_OUTPUT_FILE: "k8s-config.yaml"
	},
	env: {
		HTTP_PORT: "HTTP_PORT",
		REGION: "REGION"
	}
}