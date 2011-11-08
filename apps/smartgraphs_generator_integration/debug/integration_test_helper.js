/*globals integrationTestHelper SC Smartgraphs simulateClickOnSelector */

integrationTestHelper = SC.Object.create({

  converter: require('./converter.js'),

  authoredConent: null,

  startApp: function() {
    // Run the full app main method which would normally happen on page load
    SC.RunLoop.begin();
    Smartgraphs.statechart.set('trace', NO);
    Smartgraphs.main();
    // the statechart needs a little push, since it only goes automatically to START when it actually initializes
    // (i.e., only the first time startApp() executes. In a test, we call startApp many times.)
    Smartgraphs.statechart.gotoState('START');
    SC.RunLoop.end();
  },

  startAppWithContent: function (content) {
    this.set('authoredContent', content);
    SC.RunLoop.begin();
    window.authoredActivityJSON = this.converter.convert(content);
    this.startApp();
    Smartgraphs.statechart.sendAction('loadWindowsAuthoredActivityJSON');
    SC.RunLoop.end();
  },

  teardownApp: function() {
    Smartgraphs.getPath('mainPage.mainPane').remove();

    SC.RunLoop.begin();
    Smartgraphs.statechart.gotoState('ACTIVITY_DONE');
    this.silentlyClobberRecords(Smartgraphs.store);
    SC.RunLoop.end();
  },

  // This is a modified version of what is in jasmine-sproutcore
  // that version uses jasmine's asynchronous api but doing that appears unnecessary and
  // would complicate the use of this function
  simulateClickOnSelector: function (selector) {
    var target = SC.CoreQuery(selector);
    if(target.length === 0) throw new Error('Could not find ' + selector + ' on the page');

    SC.Event.trigger(target, 'mouseover');
    SC.Event.trigger(target, 'mousedown');
    SC.Event.trigger(target, 'focus');
    SC.Event.trigger(target, 'mouseup');
  },

  clickButton: function (text) {
    this.simulateClickOnSelector(".sc-button-view:visible:contains('" + text + "')");
  },

  NOOP: function () {},

  // SC.TreeControllers throw exceptions when their content is deleted, so delete observers before destroying records
  silentlyClobberRecords: function (store) {
    var records, storeKey, record;

    records = store.get('records');
    for (storeKey in records) {
      if ( !records.hasOwnProperty(storeKey) ) continue;
      record = records[storeKey];
      record.storeDidChangeProperties = this.NOOP;
      record._notifyPropertyObservers = this.NOOP;
    }
    store.reset();
  },
  
  addMatchers: function(jasmine) {
    jasmine.addMatchers({
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
  }

});
