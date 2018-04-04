FROM node

WORKDIR /opt/deployment-utils

COPY . .

RUN yarn install

ENTRYPOINT ["yarn", "start"]

CMD ["command=version"]