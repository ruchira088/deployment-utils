#!/usr/bin/env bash

# Installing helm
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --service-account tiller

# Waiting for tiller to be deployed
kubectl rollout status deployment tiller-deploy -n kube-system

# Deploy nginx-ingress
helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true

# Install the CustomResourceDefinition resources separately
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.11/deploy/manifests/00-crds.yaml --validate=false

# Create the namespace for cert-manager
kubectl create namespace cert-manager

# Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update your local Helm chart repository cache
helm repo update

# Install the cert-manager Helm chart
helm install \
  --name cert-manager \
  --namespace cert-manager \
  --version v0.11.0 \
  jetstack/cert-manager

aws s3 cp s3://cert-manager.ruchij.com/cert-manager-secrets.yaml . ; kubectl apply -f cert-manager-secrets.yaml; rm cert-manager-secrets.yaml

echo "Sleeping for 2 minutes..."
sleep 120
echo "Sleeping completed"

aws s3 cp s3://cert-manager.ruchij.com/cluster-issuer.yaml . ; kubectl apply -f cluster-issuer.yaml; rm cluster-issuer.yaml
