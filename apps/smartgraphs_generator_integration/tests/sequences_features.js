(function() {
  defineJasmineHelpers();
  $(function() {
    return $('body').css('overflow', 'auto');
  });
  describe("The Smartgraphs runtime, when loading content converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
    });
    return describe("when the authored content specifies an instruction sequence", function() {
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Instruction Sequence",
          "pages": [
            {
              "type": "Page",
              "name": "Introduction",
              "text": "in this activity....",
              "panes": [
                {
                  "type": "ImagePane",
                  "name": "Shoes",
                  "url": "http://smartgraphs.concord.org/static/smartgraphs/en/current/resources/images/walking_path.jpg",
                  "license": "Creative Commons BY-NC-ND 2.0",
                  "attribution": "image courtesy flickr user altopower"
                }
              ],
              "sequence": {
                "type": "InstructionSequence",
                "text": "Click the next button to get started"
              }
            }
          ]
        });
      });
      return it('should display the instruction text in a dialog-text box', function() {
        return expect("" + aSmartgraphPane + " .dialog-text").toHaveTheText("Click the next button to get started");
      });
    });
  });
}).call(this);
