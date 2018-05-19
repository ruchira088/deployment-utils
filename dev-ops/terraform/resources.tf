variable "docker_repo_name" {}

terraform {
    backend "s3" {
        bucket = "terraform.ruchij.com"
        key = "backends/BACKEND_KEY"
        region = "ap-southeast-2"
    }
}

provider "aws" {
    region = "ap-southeast-2"
}

resource "aws_ecr_repository" "ecrRepository" {
    name = "${var.docker_repo_name}"
}