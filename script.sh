#!/bin/bash
yarn install
yarn build
ln -s ~/Nextcloud/FAC/L3/PI/risking-client/api ~/Nextcloud/FAC/L3/PI/risking-client/build/api
ln -s ~/Nextcloud/FAC/L3/PI/risking-client/vendor ~/Nextcloud/FAC/L3/PI/risking-client/build/vendor
ln -s ~/Nextcloud/FAC/L3/PI/risking-client/certs ~/Nextcloud/FAC/L3/PI/risking-client/build/certs
#mv build/index.html build/index2.html
