window.integrationTestHelper = integrationTestHelper = SC.Object.create

  converter: require './converter.js'

  authoredConent: null

  startApp: ->
    # Run the full app main method which would normally happen on page load
    SC.RunLoop.begin()
    Smartgraphs.statechart.set 'trace', NO
    Smartgraphs.main()
    # the statechart needs a little push, since it only goes automatically to START when it actually initializes
    # (i.e., only the first time startApp() executes. In a test, we call startApp many times.)
    Smartgraphs.statechart.gotoState 'START'
    SC.RunLoop.end()

  startAppWithContent: (content) ->
    this.set 'authoredContent', content
    SC.RunLoop.begin()
    window.authoredActivityJSON = this.converter.convert content
    this.startApp()
    Smartgraphs.statechart.sendAction 'loadWindowsAuthoredActivityJSON'
    SC.RunLoop.end()

  teardownApp: ->
    Smartgraphs.getPath('mainPage.mainPane').remove()

    SC.RunLoop.begin()
    Smartgraphs.statechart.gotoState 'ACTIVITY_DONE'
    this.silentlyClobberRecords Smartgraphs.store
    SC.RunLoop.end()

  # This is a modified version of what is in jasmine-sproutcore
  # that version uses jasmine's asynchronous api but doing that appears unnecessary and
  # would complicate the use of this function
  simulateClickOnSelector: (selector) ->
    target = SC.CoreQuery selector
    throw new Error("Could not find #{selector} on the page") if target.length == 0

    SC.Event.trigger target, 'mouseover'
    SC.Event.trigger target, 'mousedown'
    SC.Event.trigger target, 'focus'
    SC.Event.trigger target, 'mouseup'

  clickButton: (text) ->
    this.simulateClickOnSelector ".sc-button-view:visible:contains('#{text}')"


  clickPointAt: (selector, [dataX, dataY]) ->
    graphView = Smartgraphs.activityPage.firstGraphPane.graphView
    {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
    @simulateClickOnSelector "#{selector} circle[cx='#{x}'][cy='#{y}']"
    
  graphData: ->
    integrationTestHelper.get('authoredContent').pages[0].panes[0].data

  NOOP: ->

  # SC.TreeControllers throw exceptions when their content is deleted, so delete observers before destroying records
  silentlyClobberRecords: (store) ->
    records = store.get 'records'
    for own storeKey of records
      record = records[storeKey]
      record.storeDidChangeProperties = this.NOOP
      record._notifyPropertyObservers = this.NOOP

    store.reset()

  addMatchers: (jasmine) ->
    jasmine.addMatchers
      toHaveTheText: (text) ->
        elements = $("#{this.actual}:contains('#{text}'):visible")
        elements.length > 0
      toHaveTheButton: (text) ->
        elements = $("#{this.actual} .sc-button-view:visible:contains('#{text}')")
        elements.length > 0
      toHaveTheDisabledButton: (text) ->
        elements = $("#{this.actual} .sc-button-view.disabled:visible:contains('#{text}')")
        elements.length > 0
      toHaveTheEnabledButton: (text) ->
        elements = $("#{this.actual} .sc-button-view:not(.disabled):visible:contains('#{text}')")
        elements.length > 0
      toBeEmpty2: ->
        this.actual.length == 0
      toHaveTheImageUrl: (url) ->
        for img in $("#{this.actual} img")
          return true if SC.View.views[img.id]?.get('value') == url
        false
      toExistNTimes: (n) ->
        $("#{this.actual}").length == n
      toBeVisible: ->
        $("#{this.actual}:visible").length > 0
      toContainAPointAt: (x, y) ->
        elements = $("#{this.actual} circle[cx='#{x}'][cy='#{y}']")
        elements.length > 0
      toContainThePoints: (data) ->
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        for [dataX, dataY] in data
          {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
          expect("#{this.actual}").toContainAPointAt(x, y)
      toContainTheTableData: (data) ->
        for [x, y] in data
          expect("#{this.actual} .table-column:first").toHaveTheText(x)
          expect("#{this.actual} .table-column:last").toHaveTheText(y)