# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

COPY prisma/ ./prisma/

COPY resume-api-361815-396f6055471e.json ./

# Install app dependencies
RUN npm install

# Generate DB
RUN npx prisma migrate deploy



# Copy the rest of the application code into the container
COPY . .

# Expose the port your Express app listens on (default is 3000)
EXPOSE 3000

# Command to run your Node.js application
CMD ["npm", "start"]
