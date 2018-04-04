module.exports = {
	KEY_PREFIX: "--",
	DEFAULT_REGION: "ap-southeast-2",
	ENV_REGION: "REGION",
	DEFAULT_ENCODING: "utf-8",
	VERSION_TAG_PREFIX: "v",
    K8S_TEMPLATES: ["deployment", "service", "ingress"],
	DEFAULT_VERSION_FILE: "docker-version.txt",
	DEFAULT_K8S_OUTPUT_FILE: "k8s-config.yaml"
}