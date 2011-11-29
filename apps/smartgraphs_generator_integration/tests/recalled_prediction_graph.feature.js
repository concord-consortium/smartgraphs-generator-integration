
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
    return describe("when the authored content specifies a SensorGraphPane which recalls data from a PredictionGraphPane", function() {
      beforeEach(function() {
        var appletInstance;
        appletInstance = {
          startCollecting: function() {},
          stopCollecting: function() {}
        };
        spyOn(Smartgraphs.sensorAppletController, 'get').andCallFake(function(prop) {
          if (prop === 'appletInstance') {
            return appletInstance;
          } else {
            return SC.Object.prototype.get.call(this, prop);
          }
        });
        spyOn(Smartgraphs.sensorAppletController, 'append');
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Sensor Graph on top of Prediction Graph",
          "pages": [
            {
              "type": "Page",
              "name": "Prediction graph page",
              "text": "In this activity, you'll make a prediction, then take sensor data",
              "panes": [
                {
                  "type": "PredictionGraphPane",
                  "title": "Back and Forth",
                  "yLabel": "Position",
                  "yUnits": "Meters",
                  "yMin": 0.0,
                  "yMax": 5.0,
                  "xLabel": "Time",
                  "xUnits": "Seconds",
                  "xMin": 0.0,
                  "xMax": 20.0,
                  "yTicks": 10.0,
                  "xTicks": 10.0,
                  "predictionType": "continuous_curves"
                }
              ]
            }, {
              "type": "Page",
              "name": "Sensor graph page",
              "text": "Now you can see your prediction pane, and plot sensor data on top",
              "panes": [
                {
                  "type": "SensorGraphPane",
                  "title": "Back and Forth",
                  "yLabel": "Position",
                  "yUnits": "Meters",
                  "yMin": 0.0,
                  "yMax": 5.0,
                  "xLabel": "Time",
                  "xUnits": "Seconds",
                  "xMin": 0.0,
                  "xMax": 20.0,
                  "yTicks": 10.0,
                  "xTicks": 10.0,
                  "includeAnnotationsFrom": ["page/1/pane/1"]
                }
              ]
            }
          ],
          "units": [
            {
              "type": "Unit",
              "name": "Seconds",
              "abbreviation": "s"
            }, {
              "type": "Unit",
              "name": "Meters",
              "abbreviation": "m"
            }
          ]
        });
      });
      it("should display a pane with an svg graph background", function() {
        expect("" + aSmartgraphPane + " svg").toBeVisible();
        return expect("" + aSmartgraphPane + " svg g rect").toExistNTimes(1);
      });
      it("should display a disabled 'Reset' button", function() {
        return expect("" + aSmartgraphPane).toHaveTheDisabledButton("Reset");
      });
      it("should contain a zero-length path in the annotations holder", function() {
        var annotationsHolder, pathString;
        annotationsHolder = Smartgraphs.activityPage.firstGraphPane.graphView.annotationsHolder;
        pathString = annotationsHolder.$('path').attr('d');
        return expect(pathString).toEqual("M0,0");
      });
      return describe("after the mouse is dragged across the graph", function() {
        var pathString;
        pathString = null;
        beforeEach(function() {
          var inputArea;
          inputArea = $("" + aSmartgraphPane + " svg g rect")[0];
          integrationTestHelper.fireEvent(inputArea, 'mousedown', 10, 10);
          integrationTestHelper.fireEvent(inputArea, 'mousemove', 20, 20);
          return integrationTestHelper.fireEvent(inputArea, 'mouseup', 20, 20);
        });
        it("should enable the 'Reset' button in the top pane", function() {
          return expect("" + aSmartgraphPane).toHaveTheEnabledButton("Reset");
        });
        it("should contain a no-longer-zero-length prediction-graph path", function() {
          var annotationsHolder;
          annotationsHolder = Smartgraphs.activityPage.firstGraphPane.graphView.annotationsHolder;
          pathString = annotationsHolder.$('path').attr('d');
          return expect(pathString).not.toEqual("M0,0");
        });
        return describe("and the 'Next' button is clicked", function() {
          beforeEach(function() {
            return integrationTestHelper.clickButton('Next');
          });
          it("should attempt to append a sensor applet", function() {
            return expect(Smartgraphs.sensorAppletController.append).toHaveBeenCalled();
          });
          return it("should contain the same non-zero-length prediction-graph path created in the first page", function() {
            var annotationsHolder;
            annotationsHolder = Smartgraphs.activityPage.firstGraphPane.graphView.annotationsHolder;
            return expect(annotationsHolder.$('path').attr('d')).toEqual(pathString);
          });
        });
      });
    });
  });
