#!/usr/bin/env bash
# ==============================================================================
# NervOps - Azure Test Infrastructure Teardown & Cleanup Script
# ==============================================================================
# Deletes the resource group rg-nervops-test and all nested components:
# VMs, Storage Accounts, NSGs, VNets, and Public IPs.
# ==============================================================================

set -euo pipefail

RG_NAME="${AZURE_RG:-rg-nervops-test}"

echo "=========================================================="
echo " [NervOps] Tearing Down Azure Test Environment"
echo "=========================================================="
echo " Target Resource Group: ${RG_NAME}"
echo "=========================================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "[-] Error: Azure CLI ('az') is not installed."
    exit 1
fi

# Check if the resource group exists
if ! az group exists --name "${RG_NAME}" | grep -q "true"; then
    echo "[!] Resource Group '${RG_NAME}' does not exist or has already been deleted."
    exit 0
fi

echo "[*] Deleting Resource Group '${RG_NAME}' in background (non-blocking)..."
az group delete --name "${RG_NAME}" --yes --no-wait

echo "=========================================================="
echo " [SUCCESS] Deletion initiated for '${RG_NAME}'."
echo " Azure is tearing down all associated resources asynchronously."
echo " Check status with: az group exists --name ${RG_NAME}"
echo "=========================================================="
