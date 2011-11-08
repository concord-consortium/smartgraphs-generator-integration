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
  }

});
