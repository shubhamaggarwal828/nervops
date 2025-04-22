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

# Expose the application port (update if your app uses a different port)

# Set environment variables (if any default ones are needed, they can go here)
#ENV NODE_ENV=production


ENV MONGO_URI=mongodb://admin:adminpassword@localhost:27017/MCMTOOL_DB?authSource=admin
ENV PORT=5011
ENV JWT_SECRET=your_secret_key
ENV NODE_ENV=development

#MAILTRAP_TOKEN=d72622fef6a598c43382e760cc6240b9
ENV MAILTRAP_TOKEN=1854a18f1f56370feca6a047a461c8cb
ENV MAILTRAP_ENDPOINT=https://send.api.mailtrap.io
ENV CLIENT_URL=http://localhost:5173


ENV ENCRYPTION_KEY=2c91ee9e2d3f63a5fb90e3a865476b2c9d15a8f7e3b2e517a63f1dfcb867fc21
ENV ENCRYPTION_IV=a3d7e2c3b1f8a913cb45e7b89265f43f

EXPOSE 5011


# Start the application
CMD ["node", "index.js"]
