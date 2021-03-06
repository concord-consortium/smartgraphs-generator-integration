This project host integration tests which test the output of the smartgraphs-generator format converter in the Smartgraphs runtime

To get started:

  * Clone this project and cd into its directory.
  * Install jasmine-sproutcore via git submodule update: `git submodule update --init`
  * Put smartgraphs-generator into the directory smartgraphs-generator/ in the root of the project
      * If you are developing your local smartgraphs-generator repo, you can symlink it:
          * `ln -s ../smartgraphs-generator smartgraphs-generator`
      * If you want a fresh checkout (for example on a CI server) set it up as follows:
          * `git clone http://github.com/concord-consortium/smartgraphs-generator.git`
          * **Important**: `mkdir -p smartgraphs-generator/node_modules/.bin`. This prevents sc-server from borking on the convenience symlink `nbin` in the root of smartgraphs-generator.
  * Before running Bundler (below), put Smartgraphs into the directory frameworks/Smartgraphs.
      * If you are developing your local Smartgraphs repo, you can symlink it:
          * `cd frameworks`
          * `ln -s ../../Smartgraphs Smartgraphs`
          * `cd ..`
      * If you want a fresh checkout of Smartgraphs (for example on a CI server) set it up in frameworks/Smartgraphs:
          * `git clone http://github.com/concord-consortium/Smartgraphs.git frameworks/Smartgraphs`
          * `cd frameworks/Smartgraphs`
          * `git submodule update --init --recursive`
          * `cd ../..` to get back to the root of this project.
  * Now, your Gemfile and Gemfile.lock symlinks should point to the files as defined in Smartgraphs.
  * Setup an .rvmrc file for this project, e.g.: `echo "rvm use 1.9.2@smartgraphs-generator-integration --create" > .rvmrc`
      * (Optionally, you can use the same gemset you use in the Smartgraphs repo.)
  * `cd ..; cd smartgraphs-generator-integration` (trust the .rvmrc file)
  * `bundle install --binstubs` (this should install the same gems that Smartgraphs uses.)
  * You should now be able to run `bin/sc-server` in the root of the project
  * `./opentests.sh` to see the test results (works on Macs, which have the `open` command; this script just runs `open http://localhost:4020/static/smartgraphs_generator_integration/en/current/tests.html`) 

Have CoffeeScript watch for source file changes:

 * Install node ( >= v0.6)
 * Install the CoffeeScript package ( >= 1.2.0) if you haven't already (note: you might want to learn more about npm so you know what this command is doing)
    * `npm install -g coffee-script`
 * Tell CoffeeScript to watch the source folder for changes:
    * './watch.sh` (this script runs `coffee -o apps/smartgraphs_generator_integration -wc apps/smartgraphs_generator_integration/src`)

Git-committed symlinks (handy to know about if you are developing on Windows:)

  * Gemfile -> frameworks/Smartgraphs/Gemfile
  * Gemfile.lock -> frameworks/Smartgraphs/Gemfile.lock
  * frameworks/sproutcore -> ./Smartgraphs/frameworks/sproutcore
  * frameworks/converter/convert.js -> ../../smartgraphs-generator/browser/js/converter.js
