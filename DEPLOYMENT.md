
1. Create a new resource group
2. Create a Communication Services resource (Same name)
    - Enable system managed identity
4. Buy a phone number
    - Allow inbound and outbound communication
    - Enable voice (required) and SMS (optional) capabilities
5. Copy Phonenumber in config.yaml

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
