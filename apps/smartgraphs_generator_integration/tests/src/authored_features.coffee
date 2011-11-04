defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading content converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    this.addMatchers
      toHaveTheText: (text) ->
        elements = $("#{this.actual}:contains('#{text}'):visible")
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
        for elem in $("#{this.actual} circle")
          return true if parseFloat(elem.getAttribute("cx")) == x && parseFloat(elem.getAttribute("cy")) == y
        false

  afterEach ->
    integrationTestHelper.teardownApp()

  describe "when the authored content specifies two pages", ->
    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity",
        "name": "Maria’s Run",
        "pages": [
          {
            "type": "Page",
            "name": "Introduction",
            "text": "in this activity...."
          },
          {
            "type": "Page",
            "name": "Where did she stop",
            "text": "look at the graph..."
          }
        ]

    it "should have the specified first page text initially", ->
      expect(aSmartgraphPane).toHaveTheText 'in this activity....'

    describe "after you click on the 'Next' button", ->
      beforeEach ->
        integrationTestHelper.clickButton 'Next'

      it "should have the specified second page text", ->
        expect(aSmartgraphPane).toHaveTheText 'look at the graph...'

      it "should have not have a visible 'Next' button", ->
        nextButton = $(".sc-button-view:contains('Next'):visible")
        expect(nextButton).toBeEmpty2()


  describe "when the authored content specifies a page with an image pane", ->
    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Maria’s Run"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
            "text": "in this activity...."
            "panes": [
              {
                "type": "ImagePane"
                "name": "Shoes"
                "url": "/example.jpg"
                "license": "Creative Commons BY-NC-ND 2.0"
                "attribution": "image courtesy flickr user altopower"
              }
            ]
          }
        ]

    it "should have a pane with the specified image url", ->
      expect(aSmartgraphPane).toHaveTheImageUrl '/example.jpg'

  describe "when the authored content specifies a graph", ->

    describe "with no data", ->
      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity"
          "name": "Simple Graph"
          "pages": [
            {
              "type": "Page"
              "name": "Graph"
              "text": "in this activity...."
              "panes": [
                {
                  "type": "PredefinedGraphPane"
                  "title": "Position vs. Time"
                  "yLabel": "Position"
                  "yUnits": "meters"
                  "yMin": 0
                  "yMax": 2000
                  "yTicks": 2
                  "xLabel": "Time"
                  "xUnits": "minutes"
                  "xMin": 0
                  "xMax": 10
                  "xTicks": 2
                }
              ]
            }
          ],
          "units": [
            {
              "type": "Unit"
              "name": "meters"
              "abbreviation": "m"
            },
            {
              "type": "Unit"
              "name": "minutes"
              "abbreviation": "m"
            }
          ]

      it "should display a pane with an svg graph background", ->
        expect("#{aSmartgraphPane} svg").toBeVisible()
        expect("#{aSmartgraphPane} svg g rect").toExistNTimes(1)

      it "should display two axes with ticks", ->
        expect("#{aSmartgraphPane} svg path").toExistNTimes(2)
        expect("#{aSmartgraphPane} svg").toHaveTheText("0")
        expect("#{aSmartgraphPane} svg").toHaveTheText("1000")
        expect("#{aSmartgraphPane} svg").toHaveTheText("2000")
        expect("#{aSmartgraphPane} svg").toHaveTheText("5")
        expect("#{aSmartgraphPane} svg").toHaveTheText("10")

      it "should display the correct units", ->
        expect("#{aSmartgraphPane} svg").toHaveTheText("Position (meters)")
        expect("#{aSmartgraphPane} svg").toHaveTheText("Time (minutes)")

      it "should not display any datapoints", ->
        expect("#{aSmartgraphPane} svg circle").toExistNTimes(0)

    describe "with canned data", ->
      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity"
          "name": "Simple Graph"
          "pages": [
            {
              "type": "Page"
              "name": "Graph"
              "text": "in this activity...."
              "panes": [
                {
                  "type": "PredefinedGraphPane"
                  "title": "Position vs. Time"
                  "yLabel": "Position"
                  "yUnits": "meters"
                  "yMin": 0
                  "yMax": 2000
                  "yTicks": 10
                  "xLabel": "Time"
                  "xUnits": "minutes"
                  "xMin": 0
                  "xMax": 10
                  "xTicks": 10
                  "data": [
                    [1,200]
                    [2,400]
                    [3,600]
                  ]
                }
              ]
            }
          ],
          "units": [
            {
              "type": "Unit",
              "name": "meters",
              "abbreviation": "m"
            },
            {
              "type": "Unit",
              "name": "minutes",
              "abbreviation": "m"
            }
          ]

      it "should display a pane with a graph with three data points", ->
        expect("#{aSmartgraphPane} svg").toBeVisible()
        expect("#{aSmartgraphPane} svg g rect").toExistNTimes(1)
        expect("#{aSmartgraphPane} svg circle").toExistNTimes(3)

      it "should display the data points in the authored locations", ->
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data
        for [dataX, dataY] in data
          {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
          expect("#{aSmartgraphPane} svg").toContainAPointAt(x, y)
