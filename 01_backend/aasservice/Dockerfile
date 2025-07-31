# Use the Maven image to build the application
FROM maven:3.8.5-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY pom.xml .
COPY /src ./src
RUN mvn clean package -DskipTests

# Use a minimal JDK image to run the application
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=backend-build /backend/target/*.jar ./backend.jar

# Copy the AASFullTemplate.aasx file to the desired location inside the container
COPY src/main/resources/FullAASTemplate.aasx /app/resources/

# Expose the default port for backend
EXPOSE 8080

# Start the backend
CMD ["java", "-jar", "backend.jar"]
