SET PORT=%Fabric_Endpoint_market-map-uiTypeEndpoint%
SET BUILD_ENV=%ASPNETCORE_ENVIRONMENT%
SET NODE_ENV=production
ECHO BUILD_ENV is.... %BUILD_ENV%
ECHO starting server on %PORT%
.\sf-hack\node.exe .\build\server.js