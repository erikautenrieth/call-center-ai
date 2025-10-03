
1. Create a new resource group
2. Create a Communication Services resource (Same name)
    - Enable system managed identity
4. Buy a phone number
    - Allow inbound and outbound communication
    - Enable voice (required) and SMS (optional) capabilities
5. Copy Phone number in config.yaml

6. ```az login```

7. ```make deploy name=my-rg```

8. Speicherkonto (Rechte setzen)
    - Zugriffssteuerung (IAM) - Rollen - Besitzer -> Hinzufügen

9. Container-App neustarten

#### Logs

 ```ssh
 az containerapp logs show \
  --name call-center-ai \
  --resource-group yp-zq
```

## Build Container

# Optional: Container registry, in UI erstellen

 sed -i 's/\r$//' cicd/version/version.sh

 chmod +x cicd/version/version.sh

 make build

 az acr login --name zquzcallai

 docker push zquzcallai.azurecr.io/call-center-ai

# container-app: anwendung-container: Eigenschaften

az containerapp restart --name $(container_app_name) --resource-group $(name_sanitized)

## Befehle

## show services

az cognitiveservices account list --subscription d058a8a3-67c8-4953-aaa8-2ee95a93bd36 --output table

## OpenAi model list

az cognitiveservices account list-models \
  --name zq-uz-swedencentral-openai \
  --resource-group zq-uz \
  --output table

## Restart Container-App

az containerapp update --name call-center-ai --resource-group zq-uz --image $(container_name):latest    (test)

## Debug deploy

az deployment sub create \
  --location swedencentral \
  --parameters \
    cognitiveCommunicationLocation=westeurope \
    imageVersion=latest \
    instance=zq-uz \
    openaiLocation=swedencentral \
    promptContentFilter=true \
    searchLocation=francecentral \
  --template-file cicd/bicep/main.bicep \
  --name zq-uz \
  --debug

## Rights for CosmosDB

az cosmosdb sql role assignment create \
    --account-name zq-uz \
    --resource-group zq-uz \
    --scope "/" \
    --role-definition-id "00000000-0000-0000-0000-000000000001" \
    --principal-id 09030c77-f049-4473-b22d-cf648f33ae49
