FROM mhart/alpine-node
WORKDIR /app
COPY . .
RUN yarn global add node-sass
RUN yarn
CMD yarn deploy
EXPOSE 8090