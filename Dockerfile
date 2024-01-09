FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Build
RUN npm run compile

# Copy languages
RUN mkdir -p ./build/languages
COPY ./src/locales ./build/locales
COPY ./src/ui ./build/ui
COPY ./src/views ./build/views

# Install pm2
RUN npm install pm2 -g

# Run
CMD ["pm2-runtime", "build/index.js"]
