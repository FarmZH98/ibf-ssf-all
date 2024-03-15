### Steps for setup
1. Spring intiializer to create project template (add all relevant dependencies)
2. create folder structure in project (controller, config, model, repo, service, utils etc)
3. Create tje models + built in validations
4. Create the relevant config required
5. Create the repository
6. Create the services
7. Create Thymeleaf page w validation (what validation?)
8. Create controllers
9. make sure app run + no error
10. Create Dockerfile (multi + single stage)
11. Deploy to railway (service + redis env) => railway login, link, up

### Run
mvn clean spring-boot:run

### Docker commands
clear previous cache, which could be useful if after rebuild we still get the previous version application
```
docker system prune
```

```
docker --version
```

docker build at project root ("0.01 is for versioning)
```
docker build -t FarmZH98/day16-workshop:0.01 .
```

to view existing docker images
```
docker image ls
```

to run it 
```
docker run -d -p 8080:8080 FarmZH98/day16-workshop:0.01 .
```

view it
```
docker container ls
```

stop it (mention the 1st 4 chars of container ID)
```
docker stop 83e8
```

### REDIS info
viaduct.proxy.rlwy.net - SPRING_DATA_REDIS_HOST
wtfmELkLFCkwGnzIrAnKtGLBRXaHCwYf
39254
default


### check if port in use
netstat -ano | findstr :<PORT>
sudo lsof -iTCP -sTCP:LISTEN -P -n (linux)

### connect to redis online
