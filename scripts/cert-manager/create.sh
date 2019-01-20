#!/usr/bin/env bash

helm init && \
helm install --name cert-manager --namespace kube-system --set rbac.create=false stable/cert-manager