#!/usr/bin/env bash

# Install the CustomResourceDefinition resources separately
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml

# Create the namespace for cert-manager
kubectl create namespace cert-manager

# Label the cert-manager namespace to disable resource validation
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true

# Deploy cert-manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.8.0/cert-manager-no-webhook.yaml
