#!/bin/bash

# Variables
REPO_URL="git@github.com:shubhamaggarwal828/nervops.git"
BRANCH="main"
WORKDIR="/path/to/workdir"
NETWORK_NAME="my-network"
BLUE_COMPOSE="docker-compose.blue.yml"
GREEN_COMPOSE="docker-compose.green.yml"

# Clone or Pull Latest Code
echo "Pulling latest code..."
if [ ! -d "$WORKDIR" ]; then
  git clone -b $BRANCH $REPO_URL $WORKDIR
else
  cd $WORKDIR
  git pull origin $BRANCH
fi
cd $WORKDIR

# Get Commit ID
COMMIT_ID=$(git rev-parse --short HEAD)
echo "Using commit ID: $COMMIT_ID"

# Build Docker Images
echo "Building Docker images..."
docker build -t express-app:$COMMIT_ID ./express-app
docker build -t react-app:$COMMIT_ID ./vite-react-app

# Check Current Deployment
if docker-compose -f $BLUE_COMPOSE ps | grep -q 'Up'; then
  CURRENT="blue"
  NEXT="green"
else
  CURRENT="green"
  NEXT="blue"
fi
echo "Current deployment: $CURRENT"
echo "Next deployment: $NEXT"

# Deploy New Version
echo "Deploying $NEXT environment..."
if [ "$NEXT" == "blue" ]; then
  COMPOSE_FILE=$BLUE_COMPOSE
else
  COMPOSE_FILE=$GREEN_COMPOSE
fi
docker-compose -f $COMPOSE_FILE up -d --build

# Health Check
echo "Waiting for services to become healthy..."
sleep 10  # Adjust as needed for your app's startup time

# Switch Traffic
echo "Switching traffic to $NEXT environment..."
docker-compose -f $CURRENT_COMPOSE down

# Clean Up Old Containers
echo "Cleaning up old containers..."
docker-compose -f $CURRENT_COMPOSE rm -f

# Finalize Deployment
echo "Blue-Green Deployment completed successfully."
