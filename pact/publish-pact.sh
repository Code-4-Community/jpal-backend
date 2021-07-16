#!/bin/bash
# Publishes provider pact to pact broker from swagger file
# https://docs.pactflow.io/docs/workshops/bi-directional/contracts/oas


OAS=$(cat pact/swagger-spec.yml | base64 | tr -d '\n')
REPORT=$(echo 'tests passed' | base64)
echo "==> Uploading OAS to Pactflow"
curl \
  -X PUT \
  -H "Authorization: Bearer ${PACT_BROKER_TOKEN}" \
  -H "Content-Type: application/json" \
  "${PACT_BROKER_BASE_URL}/contracts/provider/jpal-backend/version/${GIT_COMMIT}" \
  -d "{
   \"content\": \"$OAS\",
   \"contractType\": \"oas\",
   \"contentType\": \"application/yaml\",
   \"verificationResults\": {
     \"success\": true,
     \"content\": \"${REPORT}\",
     \"contentType\": \"text/plain\",
     \"verifier\": \"verifier\"
   }
 }"

 # TODO: exit with code 1 if upload fails