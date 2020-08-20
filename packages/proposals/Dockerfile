FROM mhart/alpine-node:latest

ADD ./packages/proposals/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/proposals && cp -a /tmp/node_modules /opt/app/proposals && rm -fR /tmp

ADD ./packages/common/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/common && cp -a /tmp/node_modules /opt/app/common && rm -fR /tmp &&  mkdir -p /opt/app/locations/src/models && cd /opt/app/locations/src/models  && npm install mongoose
 
WORKDIR /opt/app/proposals
ADD ./packages/proposals/. /opt/app/proposals
ADD ./packages/common/. /opt/app/common
ADD ./packages/locations/src/models/location.js /opt/app/locations/src/models

EXPOSE 3002

CMD ["npm", "run", "dev"]