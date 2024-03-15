FROM maven:3-eclipse-temurin-21

# create the appserver directory
ARG dir=/appserver
WORKDIR ${dir}

#copy everything we need into the appserver directory
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY src src
COPY .mvn .mvn

#build the application (skip test if you want to)
RUN mvn package -Dmaven.test.skip=true

#specify environment variables
ENV PORT=8080
# ENV SPRING_DATA_REDIS_HOST=localhost
# ENV SPRING_DATA_REDIS_PORT=6379
# ENV SPRING_DATA_REDIS_USERNAME=NOT_SET
# ENV SPRING_DATA_REDIS_PASSWORD=NOT_SET

#expose the port
EXPOSE ${PORT}

# start the application using CMD or ENTRYPOINT
ENTRYPOINT java -jar target/day16-workshop-0.0.1-SNAPSHOT.jar