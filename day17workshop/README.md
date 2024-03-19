### Run Docker:
docker build -t FarmZH98/day17workshop:0.01 . 
docker run -d -p 8080:8080 -e WEATHER_KEY=e5adca9f1b9e5ff5900efcb2eaaf5ac1 FarmZH98/day17workshop:0.01 .
