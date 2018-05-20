#!/bin/sh

apk -v --update add python py-pip git && \
pip install awscli --upgrade --user && \
ln -sf $HOME/.local/bin/aws /usr/local/bin

DOCKER_IMAGE_TAG=$JOB_NAME-$BUILD_NUMBER
docker build -t $DOCKER_IMAGE_TAG -f dev-ops/Dockerfile .
docker run $DOCKER_IMAGE_TAG test