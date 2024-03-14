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
docker build-t FarmZH98/day14:0.01 .
```

to view existing docker images
```
docker image ls
```

to run it 
```
docker run -d -p 8080:8081 FarmZH98/day14:0.01 .
```

view it
```
docker container ls
```

stop it (mention the 1st 4 chars of container ID)
```
docker stop 83e8
```