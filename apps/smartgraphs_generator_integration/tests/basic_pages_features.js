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
    describe("when the authored content specifies two pages", function() {
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Maria’s Run",
          "pages": [
            {
              "type": "Page",
              "name": "Introduction",
              "text": "in this activity...."
            }, {
              "type": "Page",
              "name": "Where did she stop",
              "text": "look at the graph..."
            }
          ]
        });
      });
      it("should have the specified first page text initially", function() {
        return expect(aSmartgraphPane).toHaveTheText('in this activity....');
      });
      return describe("after you click on the 'Next' button", function() {
        beforeEach(function() {
          return integrationTestHelper.clickButton('Next');
        });
        it("should have the specified second page text", function() {
          return expect(aSmartgraphPane).toHaveTheText('look at the graph...');
        });
        return it("should have not have a visible 'Next' button", function() {
          var nextButton;
          nextButton = $(".sc-button-view:contains('Next'):visible");
          return expect(nextButton).toBeEmpty2();
        });
      });
    });
    return describe("when the authored content specifies a page with an image pane", function() {
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Maria’s Run",
          "pages": [
            {
              "type": "Page",
              "name": "Introduction",
              "text": "in this activity....",
              "panes": [
                {
                  "type": "ImagePane",
                  "name": "Shoes",
                  "url": "/example.jpg",
                  "license": "Creative Commons BY-NC-ND 2.0",
                  "attribution": "image courtesy flickr user altopower"
                }
              ]
            }
          ]
        });
      });
      return it("should have a pane with the specified image url", function() {
        return expect(aSmartgraphPane).toHaveTheImageUrl('/example.jpg');
      });
    });
  });
}).call(this);
