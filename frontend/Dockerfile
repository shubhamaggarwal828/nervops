# Use a Node.js base image
FROM node:23.6.0-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source
COPY . .

# Expose the port that the app will run on (adjust as needed)
EXPOSE 5173

# Command to build the app using the current environment variables and then serve it
# (Ensure your "build" and "preview" scripts in package.json are configured properly)
CMD sh -c "npm run build && npm run preview -- --port=5173 --host=0.0.0.0"
