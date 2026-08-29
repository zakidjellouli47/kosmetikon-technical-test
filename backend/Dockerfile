FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]