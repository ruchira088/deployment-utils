variable "docker_repo_name" {}

variable "backend_key" {}

terraform {
    backend "s3" {
        bucket = "terraform.ruchij.com"
        key = "${var.backend_key}"
        region = "ap-southeast-2"
    }
}

provider "aws" {
    region = "ap-southeast-2"
}

resource "aws_ecr_repository" "ecrRepository" {
    name = "${var.docker_repo_name}"
}