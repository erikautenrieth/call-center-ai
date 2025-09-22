
1. Create a new resource group
2. Create a Communication Services resource (Same name)
    - Enable system managed identity
4. Buy a phone number
    - Allow inbound and outbound communication
    - Enable voice (required) and SMS (optional) capabilities
5. Copy Phone number in config.yaml

6. ```az login```

7. ```make deploy name=my-rg```

6. Speicherkonto (Rechte setzen)
    - Zugriffssteuerung (IAM) - Rollen - Besitzer -> Hinzufügen

#### Logs

 ```ssh
 az containerapp logs show \
  --name call-center-ai \
  --resource-group yp-zq
```

## Build Container

# Container registry, in UI erstellen

# sed -i 's/\r$//' cicd/version/version.sh

# chmod +x cicd/version/version.sh

# make build

# az acr login --name zquzcallai

# docker push zquzcallai.azurecr.io/call-center-ai

# container-app: anwendung-container: Eigenschaften

## Befehle

az cognitiveservices account list --subscription d058a8a3-67c8-4953-aaa8-2ee95a93bd36 --output table

az cognitiveservices account list-models \
  --name zq-uz-swedencentral-openai \
  --resource-group zq-uz \
  --output table

export GHCR_TOKEN=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
