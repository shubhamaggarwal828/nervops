# Use Node.js LTS as the base image
FROM node:23-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose default application port
EXPOSE 5011

# Start the application
CMD ["node", "index.js"]
