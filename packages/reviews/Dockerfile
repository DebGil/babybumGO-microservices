FROM mhart/alpine-node:latest

ADD ./packages/reviews/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/reviews && cp -a /tmp/node_modules /opt/app/reviews && rm -fR /tmp

ADD ./packages/common/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/common && cp -a /tmp/node_modules /opt/app/common && rm -fR /tmp
 
WORKDIR /opt/app/reviews
ADD ./packages/reviews/. /opt/app/reviews
ADD ./packages/common/. /opt/app/common

EXPOSE 3003

CMD ["npm", "run", "dev"]