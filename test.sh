#!/bin/sh

if [ ! -e smartgraphs-generator ]
then
  git clone http://github.com/concord-consortium/smartgraphs-generator
fi

cd smartgraphs-generator
# make sure we can checkout origin/master cleanly
rmdir node_modules/.bin    # i.e., delete only if it's the fake link we made below, not a real node_modules/.bin/
git stash     # `git reset --hard` would be dangerous on a dev machine
git fetch
git checkout origin/master
git submodule update --init
# sc-server chokes on the 'nbin' symklink which points at node_modules/.bin/ (populated by 'npm install' on dev machines)
mkdir -p node_modules/.bin/
cd ..

if [ ! -e frameworks/Smartgraphs ]
then
  git clone http://github.com/concord-consortium/Smartgraphs frameworks/Smartgraphs
fi

cd frameworks/Smartgraphs
git stash
git fetch
git checkout origin/master
git submodule update --init --recursive
cd ../..

git update-server-info --force
git submodule update --init

bundle install

# AU: we shouldn't need to do this, but I can't seem to get it updated any other way!
# bundle update sc-testdriver

rm -rf tmp
rm -rf results

# don't abort on first error
set +e

bundle exec ./hudson.rb -t "apps/smartgraphs_generator_integration" -o results -p "sc-server" -i
