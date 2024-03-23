#Multistage
FROM openjdk:21-jdk-bullseye AS builder

#Create dir for application
WORKDIR /app

COPY mvnw .
COPY pom.xml .
COPY .mvn .mvn
COPY src src

#target day17workshop-0.0.1-SNAPSHOT.jar
RUN chmod a+x /app/mvnw
RUN ./mvnw package -Dmaven.test.skip=true

#Build 2nd stage
FROM openjdk:21-jdk-bullseye

WORKDIR /app_run

## rename the jar file to weather.jar, if not just put "."
COPY --from=builder /app/target/day19-0.0.1-SNAPSHOT.jar login.jar

## Run. This line is not needed actually but putting here is like for documentation so we know we need to set this when running, the 8080 port is like this xxxx:8080*
ENV WEATHER_KEY = abc123 PORT=8080

EXPOSE ${PORT}

# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#         CMD curl http://127.0.0.1:${PORT}/healthz || exit 1

ENTRYPOINT SERVER_PORT=${PORT} java -jar login.jar