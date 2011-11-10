(function() {
  var integrationTestHelper;
  var __hasProp = Object.prototype.hasOwnProperty;
  window.integrationTestHelper = integrationTestHelper = SC.Object.create({
    converter: require('./converter.js'),
    authoredConent: null,
    startApp: function() {
      SC.RunLoop.begin();
      Smartgraphs.statechart.set('trace', NO);
      Smartgraphs.main();
      Smartgraphs.statechart.gotoState('START');
      return SC.RunLoop.end();
    },
    startAppWithContent: function(content) {
      this.set('authoredContent', content);
      SC.RunLoop.begin();
      window.authoredActivityJSON = this.converter.convert(content);
      this.startApp();
      Smartgraphs.statechart.sendAction('loadWindowsAuthoredActivityJSON');
      return SC.RunLoop.end();
    },
    teardownApp: function() {
      Smartgraphs.getPath('mainPage.mainPane').remove();
      SC.RunLoop.begin();
      Smartgraphs.statechart.gotoState('ACTIVITY_DONE');
      this.silentlyClobberRecords(Smartgraphs.store);
      return SC.RunLoop.end();
    },
    simulateClickOnSelector: function(selector) {
      var target;
      target = SC.CoreQuery(selector);
      if (target.length === 0) {
        throw new Error("Could not find " + selector + " on the page");
      }
      SC.Event.trigger(target, 'mouseover');
      SC.Event.trigger(target, 'mousedown');
      SC.Event.trigger(target, 'focus');
      return SC.Event.trigger(target, 'mouseup');
    },
    clickButton: function(text) {
      return this.simulateClickOnSelector(".sc-button-view:visible:contains('" + text + "')");
    },
    clickPointAt: function(selector, _arg) {
      var coords, dataX, dataY, graphView, x, y, _ref;
      dataX = _arg[0], dataY = _arg[1];
      graphView = Smartgraphs.activityPage.firstGraphPane.graphView;
      _ref = coords = graphView.coordinatesForPoint(dataX, dataY), x = _ref.x, y = _ref.y;
      return this.simulateClickOnSelector("" + selector + " circle[cx='" + x + "'][cy='" + y + "']");
    },
    graphData: function() {
      return integrationTestHelper.get('authoredContent').pages[0].panes[0].data;
    },
    NOOP: function() {},
    silentlyClobberRecords: function(store) {
      var record, records, storeKey;
      records = store.get('records');
      for (storeKey in records) {
        if (!__hasProp.call(records, storeKey)) continue;
        record = records[storeKey];
        record.storeDidChangeProperties = this.NOOP;
        record._notifyPropertyObservers = this.NOOP;
      }
      return store.reset();
    },
    addMatchers: function(jasmine) {
      return jasmine.addMatchers({
        toHaveTheText: function(text) {
          var elements;
          elements = $("" + this.actual + ":contains('" + text + "'):visible");
          return elements.length > 0;
        },
        toHaveTheButton: function(text) {
          var elements;
          elements = $("" + this.actual + " .sc-button-view:visible:contains('" + text + "')");
          return elements.length > 0;
        },
        toHaveTheDisabledButton: function(text) {
          var elements;
          elements = $("" + this.actual + " .sc-button-view.disabled:visible:contains('" + text + "')");
          return elements.length > 0;
        },
        toHaveTheEnabledButton: function(text) {
          var elements;
          elements = $("" + this.actual + " .sc-button-view:not(.disabled):visible:contains('" + text + "')");
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
          var elements;
          elements = $("" + this.actual + " circle[cx='" + x + "'][cy='" + y + "']");
          return elements.length > 0;
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
        },
        toHaveTheOverlay: function(dataPoints, color) {
          var coords, dataX, dataY, elements, graphView, i, path, x, y, _len, _ref, _ref2;
          graphView = Smartgraphs.activityPage.firstGraphPane.graphView;
          path = "";
          for (i = 0, _len = dataPoints.length; i < _len; i++) {
            _ref = dataPoints[i], dataX = _ref[0], dataY = _ref[1];
            _ref2 = coords = graphView.coordinatesForPoint(dataX, dataY), x = _ref2.x, y = _ref2.y;
            path += "" + (i === 0 ? "M" : "L") + x + "," + y;
          }
          console.log("looking for " + this.actual + " path[stroke='" + color + "'][d='" + path + "']");
          elements = $("" + this.actual + " path[stroke='" + color + "'][d='" + path + "']");
          console.log(elements);
          return elements.length > 0;
        }
      });
    }
  });
}).call(this);
