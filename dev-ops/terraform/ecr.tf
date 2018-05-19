provider "aws" {
    region = "ap-southeast-2"
}

variable "docker_repo_name" {}

resource "aws_ecr_repository" "ecrRepository" {
    name = "${var.docker_repo_name}"
}