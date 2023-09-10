# Use the official Kotlin parent image as the base
FROM openjdk:11-jre-slim

# Set the working directory in the image to /app
WORKDIR /app

# Copy the JAR file (which contains the Spring Boot application) into the image
COPY ./build/libs/Financey-0.0.1-SNAPSHOT-plain.jar .

# Run the application using the Java command
CMD ["java", "-jar", "/app/app.jar"]
