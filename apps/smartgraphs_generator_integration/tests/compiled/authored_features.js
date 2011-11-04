(function() {
  defineJasmineHelpers();
  $(function() {
    return $('body').css('overflow', 'auto');
  });
  describe("The Smartgraphs runtime, when loading content converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return this.addMatchers({
        toHaveTheText: function(text) {
          var elements;
          elements = $("" + this.actual + ":contains('" + text + "'):visible");
          return elements.length > 0;
        },
        toBeEmpty2: function() {
          return this.actual.length === 0;
        },
        toHaveTheImageUrl: function(url) {
          var img, _i, _len, _ref, _ref2;
          _ref = $("" + this.actual + " img");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            img = _ref[_i];
            if (((_ref2 = SC.View.views[img.id]) != null ? _ref2.get('value') : void 0) === url) {
              return true;
            }
          }
          return false;
        },
        toExistNTimes: function(n) {
          return $("" + this.actual).length === n;
        },
        toBeVisible: function() {
          return $("" + this.actual + ":visible").length > 0;
        },
        toContainAPointAt: function(x, y) {
          var elem, _i, _len, _ref;
          _ref = $("" + this.actual + " circle");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elem = _ref[_i];
            if (parseFloat(elem.getAttribute("cx")) === x && parseFloat(elem.getAttribute("cy")) === y) {
              return true;
            }
          }
          return false;
        },
        toContainThePoints: function(data) {
          var coords, dataX, dataY, graphView, x, y, _i, _len, _ref, _ref2, _results;
          graphView = Smartgraphs.activityPage.firstGraphPane.graphView;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            _ref = data[_i], dataX = _ref[0], dataY = _ref[1];
            _ref2 = coords = graphView.coordinatesForPoint(dataX, dataY), x = _ref2.x, y = _ref2.y;
            _results.push(expect("" + this.actual).toContainAPointAt(x, y));
          }
          return _results;
        },
        toContainTheTableData: function(data) {
          var x, y, _i, _len, _ref, _results;
          _results = [];
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            _ref = data[_i], x = _ref[0], y = _ref[1];
            expect("" + this.actual + " .table-column:first").toHaveTheText(x);
            _results.push(expect("" + this.actual + " .table-column:last").toHaveTheText(y));
          }
          return _results;
        }
      });
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
      return describe("with canned data", function() {
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
    });
    return describe("when the authored content specifies a table", function() {
      var aTablePane;
      aTablePane = "" + aSmartgraphPane + " .smartgraph-table";
      return describe("with attached graph", function() {
        beforeEach(function() {
          SC.RunLoop.begin();
          window.authoredActivityJSON = {
            "_id": "simple-graph-with-table.df6",
            "_rev": 1,
            "data_format_version": 6,
            "activity": {
              "title": "Simple Graph With Table",
              "url": "/shared/simple-graph-with-table",
              "owner": "shared",
              "pages": ["/shared/simple-graph-with-table/page/1-graph"],
              "axes": ["/shared/simple-graph-with-table/axes/1", "/shared/simple-graph-with-table/axes/2"]
            },
            "pages": [
              {
                "name": "Graph",
                "url": "/shared/simple-graph-with-table/page/1-graph",
                "activity": "/shared/simple-graph-with-table",
                "index": 1,
                "introText": "in this activity....",
                "steps": ["/shared/simple-graph-with-table/page/1-graph/step/1"],
                "firstStep": "/shared/simple-graph-with-table/page/1-graph/step/1"
              }
            ],
            "steps": [
              {
                "url": "/shared/simple-graph-with-table/page/1-graph/step/1",
                "activityPage": "/shared/simple-graph-with-table/page/1-graph",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/simple-graph-with-table/axes/1",
                    "yAxis": "/shared/simple-graph-with-table/axes/2",
                    "data": ["unordered-1"],
                    "annotations": []
                  },
                  "bottom": {
                    "type": "table",
                    "data": "unordered-1",
                    "annotations": []
                  }
                },
                "isFinalStep": true,
                "nextButtonShouldSubmit": true
              }
            ],
            "units": [
              {
                "url": "/shared/simple-graph-with-table/units/meters",
                "activity": null,
                "name": "meter",
                "abbreviation": "m",
                "pluralName": "meters"
              }, {
                "url": "/shared/simple-graph-with-table/units/minutes",
                "activity": null,
                "name": "minute",
                "abbreviation": "m",
                "pluralName": "minutes"
              }
            ],
            "axes": [
              {
                "url": "/shared/simple-graph-with-table/axes/1",
                "units": "/shared/simple-graph-with-table/units/minutes",
                "min": 0,
                "max": 10,
                "nSteps": 10,
                "label": "Time"
              }, {
                "url": "/shared/simple-graph-with-table/axes/2",
                "units": "/shared/simple-graph-with-table/units/meters",
                "min": 0,
                "max": 2000,
                "nSteps": 10,
                "label": "Position"
              }
            ],
            "responseTemplates": [],
            "tags": [],
            "variables": [],
            "datadefs": [
              {
                "type": "UnorderedDataPoints",
                "records": [
                  {
                    "url": "/shared/simple-graph-with-table/datadefs/unordered-1",
                    "name": "unordered-1",
                    "activity": "/shared/simple-graph-with-table",
                    "xUnits": "/shared/simple-graph-with-table/units/minutes",
                    "xLabel": "Time",
                    "xShortLabel": "Time",
                    "yUnits": "/shared/simple-graph-with-table/units/meters",
                    "yLabel": "Position",
                    "yShortLabel": "Position",
                    "points": [[1, 200], [2, 400], [3, 600]]
                  }
                ]
              }
            ],
            "annotations": []
          };
          integrationTestHelper.startApp();
          Smartgraphs.statechart.sendAction('loadWindowsAuthoredActivityJSON');
          return SC.RunLoop.end();
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
          data = [[1, 200], [2, 400], [3, 600]];
          return expect("" + aTablePane).toContainTheTableData(data);
        });
        return it('should display a graph with the authored data', function() {
          var data;
          expect("" + aTablePane + " .table-column").toExistNTimes(2);
          data = [[1, 200], [2, 400], [3, 600]];
          return expect("" + aSmartgraphPane + " svg").toContainThePoints(data);
        });
      });
    });
  });
}).call(this);
