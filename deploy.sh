#!/usr/bin/env sh

abort on errors
set -e

env PUBLIC_URL=https://github.com/codyhmelar13/Language-Access-Database/tree/main npm run build


cd build

git init
git add -A
git commit -m 'deploy'

deploying to https://codyhmelar13.github.io/language-access-database
git push -f git@github.com:codyhmelar13/Language-Access-Database.git main:gh-pages