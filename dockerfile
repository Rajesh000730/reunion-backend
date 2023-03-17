From node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
ENV PORT=8000
EXPOSE 8000
CMD ["docker", "compose", "up"]
CMD ["npm", "start"]
