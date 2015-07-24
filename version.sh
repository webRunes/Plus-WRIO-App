#!/bin/sh
chmod 600 deploy_key
mv deploy_key ~/.ssh/id_rsa
git config user.email "AlexeyAnshakov@users.noreply.github.com"
git config user.name "Alexey Anshakov"
git checkout master
npm version patch -m '%s[ci skip]'
git remote set-url origin git@github.com:webRunes/Plus-WRIO-App.git
git push origin master
