#!/bin/bash

set -v
set -x
set +e

TMP_DIR=/opt/<%= appName %>/tmp
BUNDLE_DIR=${TMP_DIR}/bundle

cd ${TMP_DIR}
rm -rf bundle
tar xvzf bundle.tar.gz > /dev/null
chmod -R +x *
chown -R ${USER} ${BUNDLE_DIR}

cd /opt/<%= appName %>/

forever stopall

if [ -d app ]; then
  sudo rm -rf app
fi

sudo mv tmp/bundle app

cd /opt/<%= appName %>/app/programs/server
npm install --save

export PORT=80
export MONGO_URL=mongodb://127.0.0.1/<%= appName %>
export ROOT_URL=http://<%= appName %>

<% for(var key in env) { %>
  export <%- key %>=<%- ("" + env[key]).replace(/./ig, '\\$&') %>
<% } %>

forever start --minUptime 3000 --spinSleepTime 3000 -l /opt/<%= appName %>/log.log -o /opt/<%= appName %>/stdout.log -e /opt/<%= appName %>/error.log -a /opt/<%= appName %>/app/main.js

#forever start --minUptime 3000 --spinSleepTime 3000 -l /opt/wsalus/log.log -o /opt/wsalus/stdout.log -e /opt/wsalus/error.log -a /opt/wsalus/app/main.js