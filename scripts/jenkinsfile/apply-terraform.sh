#!/bin/bash

apt-get update && apt-get install wget unzip jq -y

mkdir Software && \
wget -P Software https://releases.hashicorp.com/terraform/0.11.7/terraform_0.11.7_linux_amd64.zip && \
unzip -d Software Software/terraform_0.11.7_linux_amd64.zip && rm -rf Software/*.zip

terraform=\$PROJECT_ROOT/Software/terraform