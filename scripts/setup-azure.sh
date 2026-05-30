#!/usr/bin/env bash
# Sets up an Azure App Registration for M365 OAuth2 SMTP (client credentials flow).
# Requires: az CLI logged in with an account that has Application.ReadWrite.All
# and permission to grant admin consent in your tenant.
#
# Usage: bash scripts/setup-azure.sh

set -euo pipefail

APP_NAME="UnitedEarth2026"
MAIL_FROM="${MAIL_FROM:-united-earth2025@htlvb.at}"

echo "=== United-Earth2026 Azure App Registration Setup ==="
echo ""

# Get tenant ID
TENANT_ID=$(az account show --query tenantId -o tsv)
echo "Tenant ID: $TENANT_ID"

# Check if app already exists
EXISTING=$(az ad app list --display-name "$APP_NAME" --query "[0].appId" -o tsv 2>/dev/null || true)

if [ -n "$EXISTING" ]; then
  echo "App '$APP_NAME' already exists with ID: $EXISTING"
  APP_ID="$EXISTING"
else
  echo "Creating app registration '$APP_NAME'..."
  APP_ID=$(az ad app create \
    --display-name "$APP_NAME" \
    --query appId -o tsv)
  echo "Created app with ID: $APP_ID"
fi

# Create service principal if it doesn't exist
SP_EXISTS=$(az ad sp show --id "$APP_ID" --query id -o tsv 2>/dev/null || true)
if [ -z "$SP_EXISTS" ]; then
  echo "Creating service principal..."
  az ad sp create --id "$APP_ID" > /dev/null
fi

# Add SMTP.SendAsApp permission on Office 365 Exchange Online
# Resource ID: 00000002-0000-0ff1-ce00-000000000000
# SMTP.SendAsApp scope ID: 2195vfb1-ca98-40e3-b4a4-7c3218e5e8a1
echo "Adding SMTP.SendAsApp application permission..."
az ad app permission add \
  --id "$APP_ID" \
  --api "00000002-0000-0ff1-ce00-000000000000" \
  --api-permissions "2195vfb1-ca98-40e3-b4a4-7c3218e5e8a1=Role" 2>/dev/null || \
  echo "(Permission may already be set)"

# Create a new client secret (valid 2 years)
echo "Creating client secret..."
SECRET_JSON=$(az ad app credential reset \
  --id "$APP_ID" \
  --append \
  --years 2 \
  --query "{secretText: secretText}" -o json)
CLIENT_SECRET=$(echo "$SECRET_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['secretText'])")

echo ""
echo "=== Admin Consent Required ==="
echo "You must grant admin consent before the app can send emails."
echo "Go to: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/$APP_ID"
echo "Or run the following command (requires Global Admin or Privileged Role Admin):"
echo ""
echo "  az ad app permission admin-consent --id $APP_ID"
echo ""
read -rp "Press Enter after granting admin consent, or Ctrl+C to abort..."

echo ""
echo "=== Add to your .env file ==="
echo ""
cat <<EOF
DATABASE_URL=postgresql://ue:secret@db:5432/unitedearth
AZURE_TENANT_ID=$TENANT_ID
AZURE_CLIENT_ID=$APP_ID
AZURE_CLIENT_SECRET=$CLIENT_SECRET
MAIL_FROM=$MAIL_FROM
SITE_URL=https://united-earth.example.com
EOF

echo ""
echo "Done. Copy the above into your .env file."
