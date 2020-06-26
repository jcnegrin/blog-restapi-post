# Stage 1
FROM node:14.4.0-alpine3.12

# creating working directory
RUN mkdir -p /usr/src/app 
WORKDIR /usr/src/app

# installing nest dependency globally
RUN npm install -g nest

# Added dependency file for project and install it
COPY package*.json /usr/src/app/
RUN npm install

# Adding application files
COPY . /usr/src/app

# Generate build
RUN npm run build

# start app
EXPOSE 8080
ENTRYPOINT ["node", "dist/main.js"]




