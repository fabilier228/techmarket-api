docker stop test-mongo
docker rm test-mongo
docker run -d -p 27017:27017 --name test-mongo mongo:latest

nodemon server.js
