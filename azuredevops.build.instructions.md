# Azure Devops Build Steps

## Step 1
`Bash` Step

Display name: `Get last commit`
Type: `Inline`

```bash
commit=$(git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/\1/")
echo "getting last commit and populating the variable commit"
echo "this is the commit id we got"
echo $commit
echo "##vso[task.setvariable variable=commit]$commit"
```

## Step 2
`Azure CLI` Step

Display name: `Get Docker Registry Password`
Azure Subscription: `Carvana-%env% (NewSub)`
Script Location: Inline Script

```bash
password=$(az acr credential show -n cvna$(build.environment) --query passwords[0].value --output tsv)

echo "##vso[task.setvariable variable=DOCKER_REGISTRY_SERVER_PASSWORD;issecret=true]$password"
```

## Step 3 (PROD only)
`Azure CLI` Step

Display name: `Delete Staging Slot`
Azure Subscription: `Carvana-%env% (NewSub)`
Script Location: Inline Script

```bash
# delete old staging slot, if exists
az webapp deployment slot delete --resource-group $(resourceGroupName)  --name $(appServiceName) --slot staging
```

## Step 4
`Azure CLI` Step

Display name: `Get Current Docker Image Version`
Azure Subscription: `Carvana-%env% (NewSub)`
Script Location: Inline Script

```bash
linuxFxVersion=$(az webapp config show --name $(appServiceName) --resource-group $(resourceGroupName) --query linuxFxVersion | sed 's/\"//g')

if [ -z "$linuxFxVersion" ]
then
      currentDockerImageTag="latest"
else
      currentDockerImageTag=${linuxFxVersion#*:}
fi

echo "setting current docker image version to $currentDockerImageTag"
echo "##vso[task.setvariable variable=CURRENT_DOCKER_IMAGE_TAG]$currentDockerImageTag"
```

## Step 5
Azure Deployment:Create Or Update Resource Group action on $(resourceGroupName) => `Azure resource group deployment` Step

Task version: `2.*`
Azure Subscription: `Carvana-%env% (NewSub)`
Action: Create or update resource group
Resource Group: $(resourceGroupName) (follow convention: `cvna-{appname}-{env}-rg`)
Location: $(resourceGroupLocation) (`westus2`)

Template:
Template locaiton: Linked artifact 
Template: folder path from root to `template.json` (ex. `ARM/arm-template.json`)
Template parameters: folder path from root to `arm-template-params-{env}.json` (ex. `ARM/arm-template-params-$(build.environment).json`)
Override template parameters: `-dockerImageTag $(CURRENT_DOCKER_IMAGE_TAG) -dockerRegistryPassword $(DOCKER_REGISTRY_SERVER_PASSWORD)`
Deployment mode: `Complete` ** different from template

## Step 6
Build Docker Image => `Bash` Step

Type: `Inline`

```bash
docker build -t $(appRegistryName)/$(appImageName) -f Dockerfile --build-arg BUILD_TYPE=$(build.environment) --build-arg NPM_TOKEN=$(npmAuthToken) .
docker tag $(appRegistryName)/$(appImageName) $(appRegistryName)/$(appImageName):$(commit)
```

## Step 7
Push an image => `Docker` Step

Container Registry Type: `Azure Container Registry`
Azure subscription: `Carvana-%env% (NewSub)`
Azure Container Registry: `cvnadev` ** for dev - check that prod has different value in build
Action: Push an Image
Image Name: `$(appRegistryName)/$(appImageName):$(commit)`
Qualify Image Name: Checked
Include Latest Tag: Checked

Advanced Options
Force Image name to follow Docker naming convention: Checked
Working Directory: `$(System.DefaultWorkingDirectory)`

## Step 8 (PROD only)
Azure CLI creating staging slot => Azure Cli

Azure subscription: `Carvana-%env% (NewSub)`
Script Location: `Inline Script`
Inline Script: `az webapp deployment slot create --resource-group $(resourceGroupName) --name $(appServiceName) --slot staging --configuration-source $(appServiceName)`

## Step 9
Azure App Service Deploy: $(appServiceName) => `Azure App Service deploy` Step

Connection type: `Azure Resource Manager`
Azure subscription: `Carvana-%env% (NewSub)`
App Service type: `Web Apps for Containers (Linux)`
App Service name: `$(appServiceName)`
Deploy to Slot or App Service Environment: Checked
Resource Group: `$(resourceGroupName)`
Slot: `staging` (PROD only, all other env's deploy straight to the `production` slot)
Registry or Namespace: `$(appRegistryName)`
Image: `$(appImageName):$(commit)`

## Step 10 (PROD only)
Swap Slots: $(appServiceName) => `Azure App Service manage` Step

Azure subscription: `Carvana-%env% (NewSub)`
Action: `Swap Slots`
App Service Name: `$(appServiceName)`
Resource group: `$(resourceGroupName)`
Source Slot: `staging`
Swap with Production: Checked

## Step 11 (PROD only)
Delete Staging Slot => `Azure CLI` Step

Azure Subscription: `Carvana-%env% (NewSub)`
Script Location: Inline Script

```bash
az webapp deployment slot delete --resource-group $(resourceGroupName)  --name $(appServiceName) --slot staging
```

# Azure Devops Build Variables

Dev:
1) appImageName: `cvna-MarketMap.UI-ui`
2) appRegistryName: `cvnadev.azurecr.io`
3) appServiceName: `cvna-MarketMap.UI-ui-dev`
4) build.environment: `dev`
5) npmAuthToken: `(set by devops)`
6) resourceGroupLocation: `westus2`
7) resourceGroupName: `cvna-MarketMap.UI-ui-dev-rg`
8) resourceRootName: `cvna-MarketMap.UI-ui`
9) system.debug: `false`