# Use the Node image as the base
FROM node:16 AS build-step

# Set the working directory in the image to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI and dependencies
RUN npm install -g @angular/cli && npm install

# Copy the rest of the frontend application
COPY . .

# Build the Angular app
RUN ng build --configuration production

# Use Nginx to serve the Angular app
FROM nginx:1.19.0-alpine

# Copy the built Angular app to Nginx's serve folder
COPY --from=build-step /app/dist/financey-frontend /usr/share/nginx/html

# Expose port 80 (for HTTP)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
