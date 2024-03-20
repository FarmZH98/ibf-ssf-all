# Everything you need to know

### Steps for setup
1. Spring initializer to create project template (add all relevant dependencies)
2. create folder structure in project (controller, config, model, repo, service, utils etc)
3. Create the models + built in validations
4. Create the relevant config required
5. Create the repository
6. Create the services
7. Create Thymeleaf page w validation (what validation?)
8. Create controllers
9. run redis-server
10. make sure app run + no error 
11. check against redis railway
11. Create Dockerfile (multi + single stage)
12. Run Docker locally and check against railway
13. dive/troubleshoot docker
14. Deploy to railway (service + redis env) => railway login, link, up

### 9. Run REDIS
```
redis-server
```

### 10. Run
```
mvn clean spring-boot:run
```

### 11a + 12. Check against redis railway
To run locally with online redis, put in redis info into application properties
To run containerized app with online redis, add into env variables, i.e.
```
docker run -d -p 8080:8080 -e WEATHER_KEY=e5adca9f1b9e5ff5900efcb2eaaf5ac1 REDIS_KEY=XXXX REDIS_PASSWORD=XXX FarmZH98/day17workshop:v1.0.0 .
```

### 11b. Docker commands
Create docker file. There are single/multistage. Can refer to template file

clear previous cache, which could be useful if after rebuild we still get the previous version application
```
docker system prune
```

```
docker --version
```

docker build at project root ("v1.0.0 is for versioning)
```
docker build -t FarmZH98/day17workshop:v1.0.0 .
```

to view existing docker images
```
docker image ls
```

to run it 
```
docker run -d -p <port:port> -e <env variables> <jar file> .
```
```
docker run -d -p 8080:8080 -e WEATHER_KEY=e5adca9f1b9e5ff5900efcb2eaaf5ac1 FarmZH98/day17workshop:v1.0.0 .
```

view it
```
docker container ls
```

stop it (mention the 1st 4 chars of container ID)
```
docker stop 83e8
```

### 13. Dive/Troubleshoot docker
Debug docker. Command: dive <img id - 4 chars> i.e.:
```
dive 6ad8
```

(Troubleshoot) to see container file structure: docker exec -ti <container id 4 digit> /bin/sh
```
docker exec -ti 1234 /bin/sh
```

### check if port in use
netstat -ano | findstr :<PORT>
sudo lsof -iTCP -sTCP:LISTEN -P -n (linux)
