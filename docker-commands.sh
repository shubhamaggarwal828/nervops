docker network create my-network


docker run -d \
  --name mongodb \
  --network my-network \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -v mongo_data:/data/db \
  mongo:latest


docker run -d \
  --name express-app \
  --network my-network \
  -p 5011:5011 \
  --env MONGO_URI="mongodb://admin:password@mongodb:27017/mydatabase?authSource=admin" \
  node:v1


docker run -d \
  --name vite-react-app \
  --network my-network \
  -p 5173:5173 \
  --env MODE=development \
  --env VITE_DEV_API_URL="http://localhost:5011/api/auth" \
  --env VITE_AZURE_DETAILS_FETCH_API_URL="http://localhost:5011/api/azure/getAzureAccount" \
  --env VITE_AZURE_DETAILS_STORE_API_URL="http://localhost:5011/api/azure/addAzureAccount" \
  --env VITE_CRYPTO_ALGORITHM="aes-256-cbc" \
  --env VITE_CRYPTO_KEY="2c91ee9e2d3f63a5fb90e3a865476b2c9d15a8f7e3b2e517a63f1dfcb867fc21" \
  --env VITE_CRYPTO_IV="a3d7e2c3b1f8a913cb45e7b89265f43f" \
  --env VITE_AZURE_DETAILS_UPDATE_API_URL="http://localhost:5011/api/azure/updateAzureAccount" \
  --env VITE_AZURE_DETAILS_DELETE_API_URL="http://localhost:5011/api/azure/deleteAzureAccount" \
  --env VITE_AZURE_DETAILS_FETCH_SUBSCRIPTION_API_URL="http://localhost:5011/api/azure/getSubscription" \
  --env VITE_AZURE_DETAILS_FETCH_SERVICES_API_URL="http://localhost:5011/api/azure/getServices" \
  --env VITE_SECURITY_METRICS_API_URL="http://localhost:5011/api/azure/security/manual-metrics" \
  react:v1