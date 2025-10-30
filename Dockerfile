# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install system dependencies for building native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev

# 5. Install npm dependencies
RUN npm install

# 6. Copy all source code
COPY . .

# 7. Expose port
EXPOSE 5000

# 8. Start app
CMD ["node", "server.js"]
