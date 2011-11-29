(function() {
  defineJasmineHelpers();
  $(function() {
    return $('body').css('overflow', 'auto');
  });
  describe("The Smartgraphs runtime, when loading graphs and tables converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
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
          data = integrationTestHelper.graphData();
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
    return describe("when the authored content specifies a prediction graph", function() {
      describe("on a single pane", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Prediction Graph Activity",
            "pages": [
              {
                "type": "Page",
                "name": "Prediction graph page",
                "text": "In this activity, you'll make a prediction",
                "panes": [
                  {
                    "type": "PredictionGraphPane",
                    "title": "Back and Forth",
                    "yLabel": "Position",
                    "yUnits": "Distance",
                    "yMin": 0.0,
                    "yMax": 5.0,
                    "xLabel": "Time",
                    "xUnits": "Time",
                    "xMin": 0.0,
                    "xMax": 20.0,
                    "yTicks": 10.0,
                    "xTicks": 10.0
                  }
                ]
              }
            ],
            "units": [
              {
                "type": "Unit",
                "name": "Time",
                "abbreviation": "s"
              }, {
                "type": "Unit",
                "name": "Distance",
                "abbreviation": "m"
              }
            ]
          });
        });
        it("should display a pane with an svg graph background", function() {
          expect("" + aSmartgraphPane + " svg").toBeVisible();
          return expect("" + aSmartgraphPane + " svg g rect").toExistNTimes(1);
        });
        return it("should display a disabled 'Reset' button", function() {
          return expect("" + aSmartgraphPane).toHaveTheDisabledButton("Reset");
        });
      });
      return describe("on two panes", function() {
        beforeEach(function() {
          return integrationTestHelper.startAppWithContent({
            "type": "Activity",
            "name": "Prediction Graph 2-Step Activity",
            "pages": [
              {
                "type": "Page",
                "name": "Prediction graph 2-step page",
                "text": "In this activity, you'll make two predictions, one after the other",
                "panes": [
                  {
                    "type": "PredictionGraphPane",
                    "title": "Back and Forth",
                    "yLabel": "Position",
                    "yUnits": "Distance",
                    "yMin": 0.0,
                    "yMax": 5.0,
                    "xLabel": "Time",
                    "xUnits": "Time",
                    "xMin": 0.0,
                    "xMax": 20.0,
                    "yTicks": 10.0,
                    "xTicks": 10.0,
                    "predictionType": "continuous_curves"
                  }, {
                    "type": "PredictionGraphPane",
                    "title": "Back and Forth 2",
                    "yLabel": "Position",
                    "yUnits": "Distance",
                    "yMin": 0.0,
                    "yMax": 5.0,
                    "xLabel": "Time",
                    "xUnits": "Time",
                    "xMin": 0.0,
                    "xMax": 20.0,
                    "yTicks": 10.0,
                    "xTicks": 10.0,
                    "predictionType": "continuous_curves"
                  }
                ]
              }
            ],
            "units": [
              {
                "type": "Unit",
                "name": "Time",
                "abbreviation": "s"
              }, {
                "type": "Unit",
                "name": "Distance",
                "abbreviation": "m"
              }
            ]
          });
        });
        it("should display two panes with svg graph backgrounds", function() {
          return expect("" + aSmartgraphPane + " svg g rect").toExistNTimes(2);
        });
        return it("should display a disabled 'Reset' button", function() {
          return expect("" + aSmartgraphPane).toHaveTheDisabledButton("Reset");
        });
      });
    });
  });
}).call(this);
