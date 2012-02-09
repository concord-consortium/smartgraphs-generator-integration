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
    return describe("when the authored content specifies a SensorGraphPane", function() {
      var appletInstance, graphView;
      appletInstance = null;
      graphView = null;
      beforeEach(function() {
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView;
        appletInstance = {
          startCollecting: function() {},
          stopCollecting: function() {}
        };
        spyOn(appletInstance, 'startCollecting');
        spyOn(appletInstance, 'stopCollecting');
        spyOn(Smartgraphs.sensorAppletController, 'append').andCallFake(function(args) {
          if (args != null ? args.listenerPath : void 0) {
            return this.set('listenerPath', args.listenerPath);
          }
        });
        spyOn(Smartgraphs.sensorAppletController, 'get').andCallFake(function(prop) {
          if (prop === 'appletInstance') {
            return appletInstance;
          } else {
            return SC.Object.prototype.get.call(this, prop);
          }
        });
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Sensor Graph Activity",
          "pages": [
            {
              "type": "Page",
              "name": "Sensor graph page",
              "text": "In this activity, you'll walk back and forth in front of the sensor.",
              "panes": [
                {
                  "type": "SensorGraphPane",
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
      it("should display the correct x units", function() {
        return expect("" + aSmartgraphPane + " svg").toHaveTheText("Time (Time)");
      });
      it("should display the correct y units", function() {
        return expect("" + aSmartgraphPane + " svg").toHaveTheText("Position (Distance)");
      });
      it("should not display any datapoints", function() {
        return expect("" + aSmartgraphPane + " svg circle").toExistNTimes(0);
      });
      it("should request a sensor applet to be appended", function() {
        return expect(Smartgraphs.sensorAppletController.append).toHaveBeenCalled();
      });
      return describe("after the sensor applet indicates it is ready", function() {
        var listener;
        listener = null;
        beforeEach(function() {
          listener = SC.objectForPropertyPath(Smartgraphs.sensorAppletController.get('listenerPath'));
          return listener.sensorsReady();
        });
        it("should have an enabled Start button", function() {
          return expect(aSmartgraphPane).toHaveTheEnabledButton("Start");
        });
        it("should have a disabled Stop button", function() {
          return expect(aSmartgraphPane).toHaveTheDisabledButton("Stop");
        });
        it("should have a disabled Reset button", function() {
          return expect(aSmartgraphPane).toHaveTheDisabledButton("Reset");
        });
        return describe("and the Start button is clicked", function() {
          beforeEach(function() {
            return integrationTestHelper.clickButton("Start");
          });
          it("should have a disabled Start button", function() {
            return expect(aSmartgraphPane).toHaveTheDisabledButton("Start");
          });
          it("should have an enabled Stop button", function() {
            return expect(aSmartgraphPane).toHaveTheEnabledButton("Stop");
          });
          it("should have a disabled Reset button", function() {
            return expect(aSmartgraphPane).toHaveTheDisabledButton("Reset");
          });
          it("should have called the startCollecting method of the applet", function() {
            return expect(appletInstance.startCollecting).toHaveBeenCalled();
          });
          return describe("and the applet returns a data point at 1", function() {
            beforeEach(function() {
              return listener.dataReceived(null, 1, [1]);
            });
            it("should contain exactly one datapoint", function() {
              return expect("" + aSmartgraphPane + " svg circle").toExistNTimes(1);
            });
            it("should contain a data point at (0, 1)", function() {
              var x, y, _ref;
              _ref = graphView.coordinatesForPoint(0, 1), x = _ref.x, y = _ref.y;
              return expect("" + aSmartgraphPane + " svg").toContainAPointAt(x, y);
            });
            return describe("and the Stop button is clicked", function() {
              beforeEach(function() {
                return integrationTestHelper.clickButton("Stop");
              });
              it("should have a disabled Start button", function() {
                return expect(aSmartgraphPane).toHaveTheDisabledButton("Start");
              });
              it("should have an disabled Stop button", function() {
                return expect(aSmartgraphPane).toHaveTheDisabledButton("Stop");
              });
              it("should have an enabled Reset button", function() {
                return expect(aSmartgraphPane).toHaveTheEnabledButton("Reset");
              });
              it("should have called the stopCollecting method of the applet", function() {
                return expect(appletInstance.stopCollecting).toHaveBeenCalled();
              });
              it("should still contain exactly one datapoint", function() {
                return expect("" + aSmartgraphPane + " svg circle").toExistNTimes(1);
              });
              it("should still contain a data point at (0, 1)", function() {
                var x, y, _ref;
                _ref = graphView.coordinatesForPoint(0, 1), x = _ref.x, y = _ref.y;
                return expect("" + aSmartgraphPane + " svg").toContainAPointAt(x, y);
              });
              return describe("and the Reset button is clicked", function() {
                beforeEach(function() {
                  return integrationTestHelper.clickButton("Reset");
                });
                it("should have an enabled Start button", function() {
                  return expect(aSmartgraphPane).toHaveTheEnabledButton("Start");
                });
                it("should have a disabled Stop button", function() {
                  return expect(aSmartgraphPane).toHaveTheDisabledButton("Stop");
                });
                it("should have a disabled Reset button", function() {
                  return expect(aSmartgraphPane).toHaveTheDisabledButton("Reset");
                });
                return it("should no longer display any datapoints", function() {
                  var circle;
                  circle = $('svg circle')[0];
                  return expect(circle.style.display).toEqual('none');
                });
              });
            });
          });
        });
      });
    });
  });

}).call(this);
