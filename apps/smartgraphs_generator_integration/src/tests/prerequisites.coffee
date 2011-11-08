converter = require './converter.js'

describe "Prerequisites for Smartgraphs and smartgraphs-generator integration test", ->

  describe "Smartgraphs application object", ->
    it "should be defined", ->
      expect(Smartgraphs).toBeDefined()

  describe "converter.convert method", ->
    it "should be defined", ->
      expect(converter.convert).toBeDefined();
