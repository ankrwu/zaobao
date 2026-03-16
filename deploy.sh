#!/usr/bin/env sh
set -e
npm run doc:build
cd docs/.vuepress/dist

git init
git config user.email "wubaiqing@vip.qq.com"
git config user.name "wubaiqing"
git add -A
git commit -m 'deploy: 发布到 gh-pages [ci skip]'

git push -f git@github.com:ankrwu/zaobao.git master:gh-pages

cd -
