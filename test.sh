#!/bin/sh
rm -rf results
./hudson.rb -t "apps/smartgraphs_generator_integration" -o results -p "sc-server" -i
if [ `uname` == "Darwin" ] ; then open results/*.png ; fi
