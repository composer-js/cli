# Use an official Python runtime as a parent image
FROM node:12

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN apt-get update
RUN apt-get upgrade --assume-yes
RUN yarn install
RUN yarn build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV PORT 3000
ENV NODE_ENV production

# Run app.js when the container launches
CMD ["node", "dist/server.js"]