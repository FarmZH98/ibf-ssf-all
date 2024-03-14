#Build stage

FROM maven:3-eclipse-temurin-21 AS builder

#labeling docker files
LABEL MAINTAINER="farm"
LABEL APPLICATION="SSF day 14 lecture"

ARG APP_DIR=/app

#dir where it will contain src and target
WORKDIR ${APP_DIR}

# copy allr equired files ot build app into the image app folder
COPY mvnw.cmd .
COPY mvnw .
COPY pom.xml .
COPY src src
COPY .mvn .mvn

# use run command to run maven command to build package (excluding unit testing)
#download maven dependencies and build your jar file into target folder
RUN mvn package -Dmaven.test.skip=true

ENV PORT=8081

EXPOSE ${PORT}

ENTRYPOINT SERVER_PORT=${PORT} java -jar target/day14-0.0.1-SNAPSHOT.jar