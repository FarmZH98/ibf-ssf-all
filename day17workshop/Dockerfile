FROM openjdk:21-jdk-bullseye

#Create dir for application
WORKDIR /app

COPY mvnw .
COPY pom.xml .
COPY .mvn .mvn
COPY src src

RUN chmod a+x /app/mvnw
RUN ./mvnw package -Dmaven.test.skip=true

## Run. This line is not needed actually but putting here is like for documentation so we know we need to set this when running
ENV WEATHER_KEY = abc123 PORT=8080

EXPOSE ${PORT}

ENTRYPOINT SERVER_PORT=${PORT} java -jar target/day17workshop-0.0.1-SNAPSHOT.jar