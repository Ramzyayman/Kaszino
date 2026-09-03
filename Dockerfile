FROM node:18-bullseye-slim

# Install python and build tools needed for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

CMD ["npm", "start"]
