#!/bin/sh

if [ ! -e smartgraphs-generator ]
then
  git clone http://github.com/concord-consortium/smartgraphs-generator
fi

cd smartgraphs-generator
git fetch
git checkout origin/master
cd ..

if [ ! -e frameworks/Smartgraphs ]
then
  git clone http://github.com/concord-consortium/Smartgraphs frameworks/Smartgraphs
fi

cd frameworks/Smartgraphs
git fetch
git checkout origin/master
cd ../..

git update-server-info --force
git submodule update --init --recursive

bundle install

# AU: we shouldn't need to do this, but I can't seem to get it updated any other way!
# bundle update sc-testdriver

rm -rf tmp
rm -rf results

# don't abort on first error
set +e

./hudson.rb -t "apps/smartgraphs_generator_integration" -o results -p "sc-server" -i
