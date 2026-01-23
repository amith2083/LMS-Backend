# 1️ Use Node LTS (safe choice)
FROM node:20-alpine

# 2️ Set working directory
WORKDIR /app

# 3️ Copy package files
COPY package*.json ./

# 4️ Install ALL dependencies (tsc needed to build)
RUN npm install 

# 5️ Copy source code
COPY . .

# 6️ Build TypeScript → dist/
RUN npm run build

# 7️ Expose app port
EXPOSE 5000

# 8️ Start production server
CMD ["npm", "run", "start"]
