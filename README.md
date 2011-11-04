This project host integration tests which test the output of the smartgraphs-generator format converter in the Smartgraphs runtime

To get started:

  * Clone this project and cd into the directory. Setup an `.rvmrc` file, e.g.: `echo rvm use 1.9.2@smartgraphs-generator-integration`
  * `cd ..; cd smartgraphs-generator-integration` (trust the .rvmrc file)
  * `bundle install --binstubs`
  * Clone Smartgraphs into frameworks/Smartgraphs: `git clone http://github.com/concord-consortium/Smartgraphs.git frameworks/Smartgraphs`
  * `cd frameworks/Smartgraphs`
  * `git submodule update --init --recursive`
  * `cd ../..` to get back to the root of the project and clone smartgraphs-generator there: `git clone http://github.com/concord-consortium/smartgraphs-generator.git`
  * `mkdir -p smartgraphs-generator/node_modules/.bin` (This keeps `sc-server` from choking on the convenience symlink `nbin` in the root of `smartgraphs-generator` which points at the .gitignored and therefore nonexistent directory `node_modules/.bin`.)
  * you should now be able to run `bin/sc-server` in the root of the project
  * open `http://localhost:4020/static/smartgraphs_generator_integration/en/current/tests.html` to see the test results

Git-committed symlinks (handy to know about if you are developing on Windows:)

  * `frameworks/sproutcore` -> `./Smartgraphs/frameworks/sproutcore`
  * `frameworks/converter/convert.js` -> `../../smartgraphs-generator/browser/js/converter.js`
