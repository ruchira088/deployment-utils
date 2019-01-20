#!/usr/bin/env bash

snap install microk8s --classic && \
microk8s.enable dns dashboard ingress

# https://github.com/ubuntu/microk8s/issues/75
# Fix public DNS resolution inside pods
sudo iptables -P FORWARD ACCEPT