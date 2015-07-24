#!/bin/sh
git clone https://github.com/webRunes/WRIO-InternetOS.git
cd WRIO-InternetOS
npm version patch -m 'Auto rebuild by Plus-WRIO-App'
git remote set-url origin git@github.com:webRunes/WRIO-InternetOS.git
git push origin master
cd ..
rm -rf WRIO-InternetOS
rm ~/.ssh/id_rsa
