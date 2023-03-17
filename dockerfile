From node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY ./ ./
ENV PORT=8000 MONGO_URI=mongodb://mongoadmin:passwd@localhost:27017/?authSource=admin secret="youdontknowme" name="rajesh" email="rajesh@gmail.com" password="rajesh" 
EXPOSE 8000
CMD ["docker-compose", "up", "-d"]
CMD ["npm", "start"]
