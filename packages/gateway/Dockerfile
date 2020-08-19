FROM mhart/alpine-node:latest

ADD ./packages/gateway/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/gateway && cp -a /tmp/node_modules /opt/app/gateway
RUN rm -fR /tmp

ADD ./packages/common/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/common && cp -a /tmp/node_modules /opt/app/common
 
WORKDIR /opt/app/gateway
ADD ./packages/gateway/. /opt/app/gateway
ADD ./packages/common/. /opt/app/common

EXPOSE 3000

CMD ["npm", "run", "dev"]