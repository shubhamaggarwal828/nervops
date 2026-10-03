#!/usr/bin/env bash
# ==============================================================================
# NervOps - Azure Test Infrastructure Provisioning Script
# ==============================================================================
# This script creates a realistic test resource topology in Azure to evaluate
# NervOps CSPM & Infrastructure Monitoring features.
#
# Created Resources:
#   1. Resource Group: rg-nervops-test
#   2. Virtual Network & Subnet: vnet-nervops-test / snet-nervops-default
#   3. Network Security Group (NSG) with open SSH (Port 22) rule for CIS alerts
#   4. Storage Account: stnervopstest<random> (public blob enabled for audit demo)
#   5. Linux Virtual Machine (B1s - low cost / free tier eligible)
# ==============================================================================

set -euo pipefail

# Configuration
LOCATION="${AZURE_LOCATION:-eastus}"
RG_NAME="${AZURE_RG:-rg-nervops-test}"
VNET_NAME="vnet-nervops-test"
SUBNET_NAME="snet-nervops-default"
NSG_NAME="nsg-nervops-test"
VM_NAME="vm-nervops-demo"
ADMIN_USER="azureuser"
ADMIN_PASS="NervOpsDemo@2026Secure!"
RANDOM_SUFFIX=$(( RANDOM % 90000 + 10000 ))
STORAGE_NAME="stnervops${RANDOM_SUFFIX}"

echo "=========================================================="
echo " [NervOps] Provisioning Azure Test Environment"
echo "=========================================================="
echo " Resource Group: ${RG_NAME}"
echo " Location:       ${LOCATION}"
echo " Storage:        ${STORAGE_NAME}"
echo " VM Name:        ${VM_NAME}"
echo "=========================================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "[-] Error: Azure CLI ('az') is not installed. Please install 'az' or run via Azure Cloud Shell."
    exit 1
fi

# Check login status
echo "[*] Verifying Azure login state..."
az account show --output none || {
    echo "[-] Please log in with 'az login' first."
    exit 1
}

# 1. Create Resource Group
echo "[1/5] Creating Resource Group: ${RG_NAME} in ${LOCATION}..."
az group create --name "${RG_NAME}" --location "${LOCATION}" --output table

# 2. Create Network Security Group with a deliberate finding for CSPM audit (e.g. SSH port 22 open)
echo "[2/5] Creating NSG: ${NSG_NAME}..."
az network nsg create \
    --resource-group "${RG_NAME}" \
    --name "${NSG_NAME}" \
    --location "${LOCATION}" \
    --output table

echo "[*] Adding Inbound NSG rule allowing Port 22 (deliberate security test finding)..."
az network nsg rule create \
    --resource-group "${RG_NAME}" \
    --nsg-name "${NSG_NAME}" \
    --name "allow-ssh-internet" \
    --priority 1000 \
    --direction Inbound \
    --access Allow \
    --protocol Tcp \
    --source-address-prefixes '*' \
    --source-port-ranges '*' \
    --destination-address-prefixes '*' \
    --destination-port-ranges 22 \
    --output table

# 3. Create Virtual Network & Subnet linked to NSG
echo "[3/5] Creating VNet: ${VNET_NAME} & Subnet: ${SUBNET_NAME}..."
az network vnet create \
    --resource-group "${RG_NAME}" \
    --name "${VNET_NAME}" \
    --address-prefix 10.10.0.0/16 \
    --subnet-name "${SUBNET_NAME}" \
    --subnet-prefix 10.10.1.0/24 \
    --network-security-group "${NSG_NAME}" \
    --output table

# 4. Create Storage Account (allow blob public access to trigger NervOps storage finding)
echo "[4/5] Creating Storage Account: ${STORAGE_NAME}..."
az storage account create \
    --name "${STORAGE_NAME}" \
    --resource-group "${RG_NAME}" \
    --location "${LOCATION}" \
    --sku Standard_LRS \
    --kind StorageV2 \
    --allow-blob-public-access true \
    --output table

# 5. Create a small B1s Linux VM
echo "[5/5] Creating Virtual Machine: ${VM_NAME} (Standard_B1s)..."
az vm create \
    --resource-group "${RG_NAME}" \
    --name "${VM_NAME}" \
    --image Ubuntu2204 \
    --size Standard_B1s \
    --admin-username "${ADMIN_USER}" \
    --admin-password "${ADMIN_PASS}" \
    --vnet-name "${VNET_NAME}" \
    --subnet "${SUBNET_NAME}" \
    --nsg "${NSG_NAME}" \
    --public-ip-sku Standard \
    --output table

echo "=========================================================="
echo " [SUCCESS] All Test Resources Successfully Provisioned!"
echo "=========================================================="
echo " - Go to your NervOps Dashboard at http://localhost:5173"
echo " - View discovered assets under 'Overview' & 'Detailed Metrics'"
echo " - Check 'Security Audit Report' to see the CSPM analysis on ${NSG_NAME} & ${STORAGE_NAME}"
echo "=========================================================="
