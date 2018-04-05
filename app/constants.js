module.exports = {
	KEY_PREFIX: "--",
	DEFAULT_REGION: "ap-southeast-2",
	ENV_REGION: "REGION",
	DEFAULT_ENCODING: "utf-8",
	VERSION_TAG_PREFIX: "v",
    K8S_TEMPLATES: ["deployment", "service", "ingress", "configMap", "secrets"],
	DEFAULT_VERSION_FILE: "docker-version.txt",
	DEFAULT_K8S_OUTPUT_FILE: "k8s-config.yaml",
	DEFAULT_REPLICA_COUNT: 1,
	ENV_VARIABLE_PREFIX: "ENV_",
	SECRET_PREFIX: "SECRET_"
}