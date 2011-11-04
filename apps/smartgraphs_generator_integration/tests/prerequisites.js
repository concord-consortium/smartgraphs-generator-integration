/*globals Smartgraphs require describe it */

// http://localhost:4020/static/smartgraphs_generator_integration/en/current/tests/prerequisites.html

var converter = require('./converter.js');

describe("Prerequisites for Smartgraphs and smartgraphs-generator integration test", function () {

  describe("Smartgraphs application object", function () {
    it("should be defined", function () {
      expect(Smartgraphs).toBeDefined();
    });
  });

  describe("converter.convert method", function () {
    it("should be defined", function () {
      expect(converter.convert).toBeDefined();
    });
  });

});
