(function() {
  var converter;

  converter = require('./converter.js');

  describe("Prerequisites for Smartgraphs and smartgraphs-generator integration test", function() {
    describe("Smartgraphs application object", function() {
      return it("should be defined", function() {
        return expect(Smartgraphs).toBeDefined();
      });
    });
    return describe("converter.convert method", function() {
      return it("should be defined", function() {
        return expect(converter.convert).toBeDefined();
      });
    });
  });

}).call(this);
