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
    describe("when the authored content specifies a page with an image pane", function() {
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
    describe("when the authored content specifies a graph", function() {
      describe("with no data", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Simple Graph",
            "pages": [
              {
                "type": "Page",
                "name": "Graph",
                "text": "in this activity....",
                "panes": [
                  {
                    "type": "PredefinedGraphPane",
                    "title": "Position vs. Time",
                    "yLabel": "Position",
                    "yUnits": "meters",
                    "yMin": 0,
                    "yMax": 2000,
                    "yTicks": 2,
                    "xLabel": "Time",
                    "xUnits": "minutes",
                    "xMin": 0,
                    "xMax": 10,
                    "xTicks": 2
                  }
                ]
              }
            ],
            "units": [
              {
                "type": "Unit",
                "name": "meters",
                "abbreviation": "m"
              }, {
                "type": "Unit",
                "name": "minutes",
                "abbreviation": "m"
              }
            ]
          });
        });
        it("should display a pane with an svg graph background", function() {
          expect("" + aSmartgraphPane + " svg").toBeVisible();
          return expect("" + aSmartgraphPane + " svg g rect").toExistNTimes(1);
        });
        it("should display two axes with ticks", function() {
          expect("" + aSmartgraphPane + " svg path").toExistNTimes(2);
          expect("" + aSmartgraphPane + " svg").toHaveTheText("0");
          expect("" + aSmartgraphPane + " svg").toHaveTheText("1000");
          expect("" + aSmartgraphPane + " svg").toHaveTheText("2000");
          expect("" + aSmartgraphPane + " svg").toHaveTheText("5");
          return expect("" + aSmartgraphPane + " svg").toHaveTheText("10");
        });
        it("should display the correct units", function() {
          expect("" + aSmartgraphPane + " svg").toHaveTheText("Position (meters)");
          return expect("" + aSmartgraphPane + " svg").toHaveTheText("Time (minutes)");
        });
        return it("should not display any datapoints", function() {
          return expect("" + aSmartgraphPane + " svg circle").toExistNTimes(0);
        });
      });
      describe("with canned data", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Simple Graph",
            "pages": [
              {
                "type": "Page",
                "name": "Graph",
                "text": "in this activity....",
                "panes": [
                  {
                    "type": "PredefinedGraphPane",
                    "title": "Position vs. Time",
                    "yLabel": "Position",
                    "yUnits": "meters",
                    "yMin": 0,
                    "yMax": 2000,
                    "yTicks": 10,
                    "xLabel": "Time",
                    "xUnits": "minutes",
                    "xMin": 0,
                    "xMax": 10,
                    "xTicks": 10,
                    "data": [[1, 200], [2, 400], [3, 600]]
                  }
                ]
              }
            ],
            "units": [
              {
                "type": "Unit",
                "name": "meters",
                "abbreviation": "m"
              }, {
                "type": "Unit",
                "name": "minutes",
                "abbreviation": "m"
              }
            ]
          });
        });
        it("should display a pane with a graph with three data points", function() {
          expect("" + aSmartgraphPane + " svg").toBeVisible();
          expect("" + aSmartgraphPane + " svg g rect").toExistNTimes(1);
          return expect("" + aSmartgraphPane + " svg circle").toExistNTimes(3);
        });
        return it("should display the data points in the authored locations", function() {
          var coords, data, dataX, dataY, graphView, x, y, _i, _len, _ref, _ref2, _results;
          graphView = Smartgraphs.activityPage.firstGraphPane.graphView;
          data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            _ref = data[_i], dataX = _ref[0], dataY = _ref[1];
            _ref2 = coords = graphView.coordinatesForPoint(dataX, dataY), x = _ref2.x, y = _ref2.y;
            _results.push(expect("" + aSmartgraphPane + " svg").toContainAPointAt(x, y));
          }
          return _results;
        });
      });
      return describe("with no units", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Simple Graph",
            "pages": [
              {
                "type": "Page",
                "name": "Graph",
                "text": "in this activity....",
                "panes": [
                  {
                    "type": "PredefinedGraphPane",
                    "title": "Position vs. Time",
                    "yLabel": "Position",
                    "yMin": 0,
                    "yMax": 2000,
                    "yTicks": 10,
                    "xLabel": "Time",
                    "xMin": 0,
                    "xMax": 10,
                    "xTicks": 10,
                    "data": [[1, 200], [2, 400], [3, 600]]
                  }
                ]
              }
            ],
            "units": []
          });
        });
        return it("should display a graph with no units", function() {
          expect("" + aSmartgraphPane + " svg").toHaveTheText("Position");
          return expect("" + aSmartgraphPane + " svg").toHaveTheText("Time");
        });
      });
    });
    describe("when the authored content specifies a table", function() {
      var aTablePane;
      aTablePane = "" + aSmartgraphPane + " .smartgraph-table";
      return describe("with attached graph", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Graph and Table",
            "pages": [
              {
                "type": "Page",
                "name": "Graph",
                "text": "in this activity....",
                "panes": [
                  {
                    "type": "PredefinedGraphPane",
                    "title": "Position vs. Time",
                    "yLabel": "Position",
                    "yUnits": "meters",
                    "yMin": 0,
                    "yMax": 2000,
                    "yTicks": 10,
                    "xLabel": "Time",
                    "xUnits": "minutes",
                    "xMin": 0,
                    "xMax": 10,
                    "xTicks": 10,
                    "data": [[1, 200], [2, 400], [3, 600]]
                  }, {
                    "type": "TablePane"
                  }
                ]
              }
            ],
            "units": [
              {
                "type": "Unit",
                "name": "meters",
                "abbreviation": "m"
              }, {
                "type": "Unit",
                "name": "minutes",
                "abbreviation": "m"
              }
            ]
          });
        });
        it('should display a graph pane and a table pane', function() {
          expect(aSmartgraphPane).toExistNTimes(3);
          expect("" + aSmartgraphPane + " svg").toBeVisible();
          return expect("" + aTablePane).toBeVisible();
        });
        it('should display a table with the authored headings', function() {
          expect(aTablePane).toHaveTheText("Time (m)");
          return expect(aTablePane).toHaveTheText("Position (m)");
        });
        it('should display a table with the authored data', function() {
          var data;
          data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data;
          return expect("" + aTablePane).toContainTheTableData(data);
        });
        return it('should display a graph with the authored data', function() {
          var data;
          expect("" + aTablePane + " .table-column").toExistNTimes(2);
          data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data;
          return expect("" + aSmartgraphPane + " svg").toContainThePoints(data);
        });
      });
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
