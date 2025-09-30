# Use a Node.js base image to build the application.
# The `18-alpine` tag is a lightweight, secure image.
FROM node:18-alpine

# Set the working directory inside the container.
# All subsequent commands will be run from this directory.
WORKDIR /app

# Copy the package.json and package-lock.json files first.
# This allows Docker to cache the npm install step, speeding up subsequent builds.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the firebase configuration directory and its contents.
# This is necessary for the backend to connect to your Firebase project.
COPY ./firebase ./firebase

# Copy the rest of the application source code into the container.
COPY . .

# Expose the port on which the Node.js application will listen.
# This makes the port available to other services in the Docker network.
EXPOSE 3000

# Define the command to run the application.
# The CMD specifies the default command to execute when the container starts.
CMD ["node", "index.js"]