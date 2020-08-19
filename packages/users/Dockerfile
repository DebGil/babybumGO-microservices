FROM mhart/alpine-node:latest

ADD ./packages/users/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/users && cp -a /tmp/node_modules /opt/app/users
RUN rm -fR /tmp

ADD ./packages/common/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/common && cp -a /tmp/node_modules /opt/app/common
RUN mkdir -p /opt/app/locations/src/models && cd /opt/app/locations/src/models && npm install mongoose

WORKDIR /opt/app/users
ADD ./packages/users /opt/app/users
ADD ./packages/common/. /opt/app/common
ADD ./packages/locations/src/models/location.js /opt/app/locations/src/models

EXPOSE 3004

CMD ["npm", "run", "dev"]