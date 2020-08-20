FROM mhart/alpine-node:latest

ADD ./packages/locations/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/locations && cp -a /tmp/node_modules /opt/app/locations && rm -fR /tmp

ADD ./packages/common/package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app/common && cp -a /tmp/node_modules /opt/app/common && mkdir -p /opt/app/proposals/src/models && cd /opt/app/proposals/src/models  && npm install mongoose && rm -fR /tmp

WORKDIR /opt/app/locations
ADD ./packages/locations/. /opt/app/locations
ADD ./packages/common/. /opt/app/common
ADD ./packages/proposals/src/models/proposal.js /opt/app/proposals/src/models


EXPOSE 3001

CMD ["npm", "run", "dev"]