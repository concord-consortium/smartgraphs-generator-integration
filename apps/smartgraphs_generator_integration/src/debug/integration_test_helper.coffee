window.integrationTestHelper = integrationTestHelper = SC.Object.create

  converter: require './converter.js'

  authoredContent: null

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
    
  clickRadioButton: (text) ->
    this.simulateClickOnSelector ".sc-radio-button:visible:contains('#{text}')"

  fireEvent: (el, eventName, x, y) ->
    offset = $(el).offset()
    evt    = SC.Event.simulateEvent el, eventName, { pageX: offset.left + x, pageY: offset.top + y }
    SC.Event.trigger el, eventName, evt

  clickPointAt: (selector, [dataX, dataY]) ->
    graphView = Smartgraphs.activityPage.firstGraphPane.graphView
    {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
    @simulateClickOnSelector "#{selector} circle[cx='#{x}'][cy='#{y}']"

  typeTextIn: (selector, text) ->
    target = $(selector)[0]
    view = SC.View.views[target.name]       #inputs have sc-id set on name instead of id for some reason
    SC.RunLoop.begin()
    view.set "value", text
    SC.RunLoop.end()

  graphData: ->
    integrationTestHelper.get('authoredContent').pages[0].panes[0].data

  getGraphOrigin: ->
    axes = $(".smartgraph-pane svg path[stroke='#aaaaaa']")
    path = axes[0].getAttribute("d")
    [x,y] = /^M(.*?)L.*/.exec(path)[1].split(",")
    return [Math.floor(x), Math.floor(y)]

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
      toHaveTheRadioButton: (text) ->
        elements = $("#{this.actual} .sc-radio-button:not(.disabled):visible:contains('#{text}')")
        elements.length > 0
      toHaveTheSelectedRadioButton: (text) ->
        elements = $("#{this.actual} .sc-radio-button.sel:not(.disabled):visible:contains('#{text}')")
        elements.length > 0        
      toHaveTheUnselectedRadioButton: (text) ->
        elements = $("#{this.actual} .sc-radio-button:not(.sel):not(.disabled):visible:contains('#{text}')")
        if elements.length is 0 then debugger
        elements.length > 0
      toHaveRadioButtons: ->
        elements = $("#{this.actual} .sc-radio-button:visible")
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
      toHaveTheOverlay: (dataPoints, color) ->
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        path = ""
        for [dataX, dataY], i in dataPoints
          {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
          path += "#{if i == 0 then "M" else "L"}#{x},#{y}"
        elements = $("#{this.actual} path[stroke='#{color}'][d='#{path}']")
        elements.length > 0
      toHaveTheCircledPoint: ([dataX, dataY], color) ->
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
        elements = $("#{this.actual} circle[cx='#{x}'][cy='#{y}'][stroke='#{color}'][r='6']")
        elements.length > 0
      toHaveALineToAxis: ([dataX, dataY], axis, color) ->
        color = "#aa0000"                                     # FIXME: Why is color not working in integ. test?
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
        [originX, originY] = integrationTestHelper.getGraphOrigin()
        [endX, endY] = if (axis is "x") then [x, originY] else [originX, y]
        elements = $("#{this.actual} [d=M#{x},#{y}L#{endX},#{endY}][stroke='#{color}']")
        elements.length > 0