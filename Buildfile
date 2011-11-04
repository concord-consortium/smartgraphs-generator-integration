# ==========================================================================
# Project:   SmartgraphsGeneratorIntegration
# Copyright: @2011 My Company, Inc.
# ==========================================================================

# This is your Buildfile, which sets build settings for your project.
# For example, this tells SproutCore's build tools that your requires
# the SproutCore framework.
config :all, :required => :sproutcore
config :smartgraphs_generator_integration, :required => ['Smartgraphs/smartgraphs', 'converter']

namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end
