(function() {
  defineJasmineHelpers();
  $(function() {
    return $('body').css('overflow', 'auto');
  });
  describe("The Smartgraphs runtime, when loading sequences converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
    });
    describe("when the authored content specifies an instruction sequence", function() {
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
    return describe("when the authored content specifies a pick-a-point sequence", function() {
      return describe("with one page", function() {
        beforeEach(function() {
          SC.RunLoop.begin();
          window.authoredActivityJSON = {
            "_id": "pick-a-point-sequence.df6",
            "_rev": 1,
            "data_format_version": 6,
            "activity": {
              "title": "Pick A Point Sequence",
              "url": "/shared/pick-a-point-sequence",
              "owner": "shared",
              "pages": ["/shared/pick-a-point-sequence/page/1-introduction"],
              "axes": ["/shared/pick-a-point-sequence/axes/1", "/shared/pick-a-point-sequence/axes/2"]
            },
            "pages": [
              {
                "name": "Introduction",
                "url": "/shared/pick-a-point-sequence/page/1-introduction",
                "activity": "/shared/pick-a-point-sequence",
                "index": 1,
                "introText": "in this activity....",
                "steps": ["/shared/pick-a-point-sequence/page/1-introduction/step/1", "/shared/pick-a-point-sequence/page/1-introduction/step/2", "/shared/pick-a-point-sequence/page/1-introduction/step/3", "/shared/pick-a-point-sequence/page/1-introduction/step/4", "/shared/pick-a-point-sequence/page/1-introduction/step/5"],
                "firstStep": "/shared/pick-a-point-sequence/page/1-introduction/step/1"
              }
            ],
            "steps": [
              {
                "url": "/shared/pick-a-point-sequence/page/1-introduction/step/1",
                "activityPage": "/shared/pick-a-point-sequence/page/1-introduction",
                "beforeText": "Click the point...",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/pick-a-point-sequence/axes/1",
                    "yAxis": "/shared/pick-a-point-sequence/axes/2",
                    "annotations": ["highlighted-point-1"],
                    "data": ["datadef-1"]
                  },
                  "bottom": {
                    "type": "table",
                    "data": "datadef-1",
                    "annotations": ["highlighted-point-1"]
                  }
                },
                "tools": [
                  {
                    "name": "tagging",
                    "setup": {
                      "tag": "tag-1",
                      "data": "datadef-1"
                    }
                  }
                ],
                "submitButtonTitle": "Check My Answer",
                "responseBranches": [
                  {
                    "criterion": ["coordinates=", "tag-1", 4, 800],
                    "step": "/shared/pick-a-point-sequence/page/1-introduction/step/5"
                  }
                ],
                "defaultBranch": "/shared/pick-a-point-sequence/page/1-introduction/step/2",
                "isFinalStep": false
              }, {
                "url": "/shared/pick-a-point-sequence/page/1-introduction/step/2",
                "activityPage": "/shared/pick-a-point-sequence/page/1-introduction",
                "beforeText": "Look at the graph...",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/pick-a-point-sequence/axes/1",
                    "yAxis": "/shared/pick-a-point-sequence/axes/2",
                    "annotations": ["highlighted-point-1"],
                    "data": ["datadef-1"]
                  },
                  "bottom": {
                    "type": "table",
                    "data": "datadef-1",
                    "annotations": ["highlighted-point-1"]
                  }
                },
                "tools": [
                  {
                    "name": "tagging",
                    "setup": {
                      "tag": "tag-1",
                      "data": "datadef-1"
                    }
                  }
                ],
                "submitButtonTitle": "Check My Answer",
                "responseBranches": [
                  {
                    "criterion": ["coordinates=", "tag-1", 4, 800],
                    "step": "/shared/pick-a-point-sequence/page/1-introduction/step/5"
                  }
                ],
                "defaultBranch": "/shared/pick-a-point-sequence/page/1-introduction/step/3",
                "isFinalStep": false
              }, {
                "url": "/shared/pick-a-point-sequence/page/1-introduction/step/3",
                "activityPage": "/shared/pick-a-point-sequence/page/1-introduction",
                "beforeText": "In these two intervals....",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/pick-a-point-sequence/axes/1",
                    "yAxis": "/shared/pick-a-point-sequence/axes/2",
                    "annotations": ["highlighted-point-1"],
                    "data": ["datadef-1"]
                  },
                  "bottom": {
                    "type": "table",
                    "data": "datadef-1",
                    "annotations": ["highlighted-point-1"]
                  }
                },
                "tools": [
                  {
                    "name": "tagging",
                    "setup": {
                      "tag": "tag-1",
                      "data": "datadef-1"
                    }
                  }
                ],
                "submitButtonTitle": "Check My Answer",
                "responseBranches": [
                  {
                    "criterion": ["coordinates=", "tag-1", 4, 800],
                    "step": "/shared/pick-a-point-sequence/page/1-introduction/step/5"
                  }
                ],
                "defaultBranch": "/shared/pick-a-point-sequence/page/1-introduction/step/4",
                "isFinalStep": false
              }, {
                "url": "/shared/pick-a-point-sequence/page/1-introduction/step/4",
                "activityPage": "/shared/pick-a-point-sequence/page/1-introduction",
                "beforeText": "If you look carefully, ....",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/pick-a-point-sequence/axes/1",
                    "yAxis": "/shared/pick-a-point-sequence/axes/2",
                    "annotations": [],
                    "data": ["datadef-1"]
                  },
                  "bottom": {
                    "type": "table",
                    "data": "datadef-1",
                    "annotations": []
                  }
                },
                "nextButtonShouldSubmit": true,
                "isFinalStep": true
              }, {
                "url": "/shared/pick-a-point-sequence/page/1-introduction/step/5",
                "activityPage": "/shared/pick-a-point-sequence/page/1-introduction",
                "beforeText": "Four minutes into her run ....",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/pick-a-point-sequence/axes/1",
                    "yAxis": "/shared/pick-a-point-sequence/axes/2",
                    "annotations": [],
                    "data": ["datadef-1"]
                  },
                  "bottom": {
                    "type": "table",
                    "data": "datadef-1",
                    "annotations": []
                  }
                },
                "nextButtonShouldSubmit": true,
                "isFinalStep": true
              }
            ],
            "responseTemplates": [],
            "axes": [
              {
                "url": "/shared/pick-a-point-sequence/axes/1",
                "min": 0,
                "max": 10,
                "nSteps": 10,
                "label": "Time"
              }, {
                "url": "/shared/pick-a-point-sequence/axes/2",
                "min": 0,
                "max": 2000,
                "nSteps": 10,
                "label": "Position"
              }
            ],
            "datadefs": [
              {
                "type": "UnorderedDataPoints",
                "records": [
                  {
                    "url": "/shared/pick-a-point-sequence/datadefs/datadef-1",
                    "name": "datadef-1",
                    "activity": "/shared/pick-a-point-sequence",
                    "xLabel": "Time",
                    "xShortLabel": "Time",
                    "yLabel": "Position",
                    "yShortLabel": "Position",
                    "points": [[1, 200], [2, 400], [3, 600], [4, 800]]
                  }
                ]
              }
            ],
            "tags": [
              {
                "url": "/shared/pick-a-point-sequence/tags/tag-1",
                "activity": "/shared/pick-a-point-sequence",
                "name": "tag-1"
              }
            ],
            "annotations": [
              {
                "type": "HighlightedPoint",
                "records": [
                  {
                    "url": "/shared/pick-a-point-sequence/annotations/highlighted-point-1",
                    "name": "highlighted-point-1",
                    "activity": "/shared/pick-a-point-sequence",
                    "datadefName": "datadef-1",
                    "tag": "/shared/pick-a-point-sequence/tags/tag-1",
                    "color": "#1f77b4"
                  }
                ]
              }
            ],
            "variables": [],
            "units": []
          };
          integrationTestHelper.startApp();
          Smartgraphs.statechart.sendAction('loadWindowsAuthoredActivityJSON');
          return SC.RunLoop.end();
        });
        it('should show the first step initially', function() {
          return expect("" + aSmartgraphPane + " .dialog-text").toHaveTheText("Click the point...");
        });
        it('should have a Check Answer button which is disabled', function() {
          expect("" + aSmartgraphPane).toHaveTheButton("Check My Answer");
          return expect("" + aSmartgraphPane).toHaveTheDisabledButton("Check My Answer");
        });
        describe('when an incorrect point is clicked', function() {
          beforeEach(function() {
            return integrationTestHelper.clickPointAt("" + aSmartgraphPane + " svg", [1, 200]);
          });
          it('should enable the Check Answer button', function() {
            return expect("" + aSmartgraphPane).toHaveTheEnabledButton("Check My Answer");
          });
          return it('should show the first hint after the button is pressed', function() {
            integrationTestHelper.clickButton("Check My Answer");
            return expect("" + aSmartgraphPane + " .dialog-text").toHaveTheText("Look at the graph...");
          });
        });
        return describe('when the correct point is clicked and the button is pressed', function() {
          beforeEach(function() {
            integrationTestHelper.clickPointAt("" + aSmartgraphPane + " svg", [4, 800]);
            return integrationTestHelper.clickButton("Check My Answer");
          });
          return it('should show the final step', function() {
            return expect("" + aSmartgraphPane + " .dialog-text").toHaveTheText("Four minutes into her run ....");
          });
        });
      });
    });
  });
}).call(this);
