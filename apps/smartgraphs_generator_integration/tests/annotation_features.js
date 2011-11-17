(function() {
  defineJasmineHelpers();
  $(function() {
    return $('body').css('overflow', 'auto');
  });
  describe("The Smartgraphs runtime, when loading graph annotations converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
    });
    describe("with range visual prompts", function() {
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Pick A Point Sequence",
          "pages": [
            {
              "type": "Page",
              "name": "Introduction",
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
                  "data": [[1, 200], [2, 400], [3, 600], [4, 800], [5, 1000]]
                }, {
                  "type": "TablePane"
                }
              ],
              "sequence": {
                "type": "PickAPointSequence",
                "initialPrompt": {
                  "text": "Click the point...",
                  "visualPrompts": [
                    {
                      "type": "RangeVisualPrompt",
                      "name": "1 to 3",
                      "xMin": 1,
                      "xMax": 3,
                      "color": "#ff0000"
                    }
                  ]
                },
                "correctAnswerPoint": [4, 800],
                "hints": [],
                "giveUp": {
                  "text": "If you look carefully, ....",
                  "visualPrompts": [
                    {
                      "type": "RangeVisualPrompt",
                      "name": "Unbounded left",
                      "xMax": 3,
                      "color": "#00ff00"
                    }, {
                      "type": "RangeVisualPrompt",
                      "name": "Unbounded right",
                      "xMin": 4,
                      "color": "#0000ff"
                    }
                  ]
                },
                "confirmCorrect": {
                  "text": "Four minutes into her run ...."
                }
              }
            }
          ]
        });
      });
      describe('when the initial step is loaded', function() {
        return it('should show the first range visual prompt', function() {
          var data, highlightedPoints;
          data = integrationTestHelper.graphData();
          highlightedPoints = data.slice(0, 3);
          return expect("" + aSmartgraphPane + " svg").toHaveTheOverlay(highlightedPoints, "#ff0000");
        });
      });
      return describe('when an incorrect point is clicked', function() {
        beforeEach(function() {
          integrationTestHelper.clickPointAt("" + aSmartgraphPane + " svg", [1, 200]);
          return integrationTestHelper.clickButton("Check My Answer");
        });
        return it('should show the two give-up range visual prompts', function() {
          var data, highlightedPoints1, highlightedPoints2;
          data = integrationTestHelper.graphData();
          highlightedPoints1 = data.slice(0, 3);
          expect("" + aSmartgraphPane + " svg").toHaveTheOverlay(highlightedPoints1, "#00ff00");
          highlightedPoints2 = data.slice(3, 5);
          return expect("" + aSmartgraphPane + " svg").toHaveTheOverlay(highlightedPoints2, "#0000ff");
        });
      });
    });
    return describe("with circled-point visual prompts", function() {
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Pick A Point Sequence",
          "pages": [
            {
              "type": "Page",
              "name": "Introduction",
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
                  "data": [[1, 200], [2, 400], [3, 600], [4, 800], [5, 1000]]
                }, {
                  "type": "TablePane"
                }
              ],
              "sequence": {
                "type": "PickAPointSequence",
                "initialPrompt": {
                  "text": "Click the point...",
                  "visualPrompts": [
                    {
                      "type": "PointCircleVisualPrompt",
                      "name": "1 to 2",
                      "point": [4, 800],
                      "color": "red"
                    }
                  ]
                },
                "correctAnswerPoint": [4, 800],
                "hints": [],
                "giveUp": {
                  "text": "If you look carefully, ....",
                  "visualPrompts": [
                    {
                      "type": "PointCircleVisualPrompt",
                      "name": "1 to 2",
                      "point": [3, 600],
                      "color": "#00ff00"
                    }, {
                      "type": "PointCircleVisualPrompt",
                      "name": "1 to 2",
                      "point": [5, 1000],
                      "color": "blue"
                    }
                  ]
                },
                "confirmCorrect": {
                  "text": "Four minutes into her run ...."
                }
              }
            }
          ]
        });
      });
      describe('when the initial step is loaded', function() {
        return it('should show the first range visual prompt', function() {
          return expect("" + aSmartgraphPane + " svg").toHaveTheCircledPoint([4, 800], "#ff0000");
        });
      });
      return describe('when an incorrect point is clicked', function() {
        beforeEach(function() {
          integrationTestHelper.clickPointAt("" + aSmartgraphPane + " svg", [1, 200]);
          return integrationTestHelper.clickButton("Check My Answer");
        });
        return it('should show the two give-up range visual prompts', function() {
          expect("" + aSmartgraphPane + " svg").toHaveTheCircledPoint([3, 600], "#00ff00");
          return expect("" + aSmartgraphPane + " svg").toHaveTheCircledPoint([5, 1000], "#0000ff");
        });
      });
    });
  });
}).call(this);
