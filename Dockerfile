FROM node:slim

WORKDIR /opt/deployment-utils

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install

COPY . .

ENTRYPOINT ["npm", "run"]

CMD ["start", "command=version"]