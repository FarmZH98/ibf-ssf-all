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
COPY --from=builder /app/target/sff-practice-test-0.0.1-SNAPSHOT.jar todo.jar
COPY --from=builder /app/src/main/resources/static/todos.txt /app_run/src/main/resources/static/todos.txt

## Run. This line is not needed actually but putting here is like for documentation so we know we need to set this when running, the 8080 port is like this xxxx:8080*
ENV PORT=8080

EXPOSE ${PORT}

# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#         CMD curl http://127.0.0.1:${PORT}/healthz || exit 1

ENTRYPOINT SERVER_PORT=${PORT} java -jar todo.jar