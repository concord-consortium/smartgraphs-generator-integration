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
      toContainThePoints: (data) ->
        graphView = Smartgraphs.activityPage.firstGraphPane.graphView
        for [dataX, dataY] in data
          {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
          expect("#{this.actual}").toContainAPointAt(x, y)
      toContainTheTableData: (data) ->
        for [x, y] in data
          expect("#{this.actual} .table-column:first").toHaveTheText(x)
          expect("#{this.actual} .table-column:last").toHaveTheText(y)

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

  describe "when the authored content specifies a table", ->

    aTablePane = "#{aSmartgraphPane} .smartgraph-table"

    describe "with no graph", ->
      beforeEach ->
        # PENDING we don't have a converter for this yet, so use runtime json
        SC.RunLoop.begin();
        window.authoredActivityJSON =
          {
            "_id": "simple-table.df6",
            "_rev": 1,
            "data_format_version": 6,
            "activity": {
              "title": "Simple Table",
              "url": "/shared/simple-table",
              "owner": "shared",
              "pages": [
                "/shared/simple-table/page/1-table"
              ],
              "axes": [
                "/shared/simple-table/axes/1",
                "/shared/simple-table/axes/2"
              ]
            },
            "pages": [
              {
                "name": "Table",
                "url": "/shared/simple-table/page/1-table",
                "activity": "/shared/simple-table",
                "index": 1,
                "introText": "in this activity....",
                "steps": [
                  "/shared/simple-table/page/1-table/step/1"
                ],
                "firstStep": "/shared/simple-table/page/1-table/step/1"
              }
            ],
            "steps": [
              {
                "url": "/shared/simple-table/page/1-table/step/1",
                "activityPage": "/shared/simple-table/page/1-table",
                "paneConfig": "single",
                "panes": {
                  "single": {
                    "type": "table",
                    "data": "unordered-1",
                    "annotations": []
                  }
                },
                "isFinalStep": true,
                "nextButtonShouldSubmit": true
              }
            ],
            "units": [
              {
                "url": "/shared/simple-table/units/meters",
                "activity": null,
                "name": "meter",
                "abbreviation": "m",
                "pluralName": "meters"
              },
              {
                "url": "/shared/simple-table/units/minutes",
                "activity": null,
                "name": "minute",
                "abbreviation": "m",
                "pluralName": "minutes"
              }
            ],
            "axes": [
              {
                "url": "/shared/simple-table/axes/1",
                "units": "/shared/simple-table/units/minutes",
                "min": 0,
                "max": 10,
                "nSteps": 10,
                "label": "Time"
              },
              {
                "url": "/shared/simple-table/axes/2",
                "units": "/shared/simple-table/units/meters",
                "min": 0,
                "max": 2000,
                "nSteps": 10,
                "label": "Position"
              }
            ],
            "responseTemplates": [
            ],
            "tags": [
            ],
            "variables": [
            ],
            "datadefs": [
              {
                "type": "UnorderedDataPoints",
                "records": [
                  {
                    "url": "/shared/simple-table/datadefs/unordered-1",
                    "name": "unordered-1",
                    "activity": "/shared/simple-table",
                    "xUnits": "/shared/simple-table/units/minutes",
                    "xLabel": "Time",
                    "xShortLabel": "Time",
                    "yUnits": "/shared/simple-table/units/meters",
                    "yLabel": "Position",
                    "yShortLabel": "Position",
                    "points": [[1,200], [2,400], [3,600]]
                  }
                ]
              }
            ],
            "annotations": []
          }
        integrationTestHelper.startApp()
        Smartgraphs.statechart.sendAction 'loadWindowsAuthoredActivityJSON'
        SC.RunLoop.end();

      it 'should display a table pane', ->
        expect(aTablePane).toBeVisible()

      it 'should display the authored headings', ->
        expect(aTablePane).toHaveTheText("Time (m)")
        expect(aTablePane).toHaveTheText("Position (m)")

      it 'should display columns with the authored data', ->
        expect("#{aTablePane} .table-column").toExistNTimes(2)
        # data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data  // this will work when we use converter
        data = [[1,200], [2,400], [3,600]]
        expect("#{aTablePane}").toContainTheTableData(data)

    describe "with attached graph", ->
      beforeEach ->
        # PENDING we don't have a converter for this yet, so use runtime json
        SC.RunLoop.begin();
        window.authoredActivityJSON =
          {
            "_id": "simple-graph-with-table.df6",
            "_rev": 1,
            "data_format_version": 6,
            "activity": {
              "title": "Simple Graph With Table",
              "url": "/shared/simple-graph-with-table",
              "owner": "shared",
              "pages": [
                "/shared/simple-graph-with-table/page/1-graph"
              ],
              "axes": [
                "/shared/simple-graph-with-table/axes/1",
                "/shared/simple-graph-with-table/axes/2"
              ]
            },
            "pages": [
              {
                "name": "Graph",
                "url": "/shared/simple-graph-with-table/page/1-graph",
                "activity": "/shared/simple-graph-with-table",
                "index": 1,
                "introText": "in this activity....",
                "steps": [
                  "/shared/simple-graph-with-table/page/1-graph/step/1"
                ],
                "firstStep": "/shared/simple-graph-with-table/page/1-graph/step/1"
              }
            ],
            "steps": [
              {
                "url": "/shared/simple-graph-with-table/page/1-graph/step/1",
                "activityPage": "/shared/simple-graph-with-table/page/1-graph",
                "paneConfig": "split",
                "panes": {
                  "top": {
                    "type": "graph",
                    "title": "Position vs. Time",
                    "xAxis": "/shared/simple-graph-with-table/axes/1",
                    "yAxis": "/shared/simple-graph-with-table/axes/2",
                    "data" : ["unordered-1"],
                    "annotations": []
                  },
                  "bottom": {
                    "type": "table",
                    "data": "unordered-1",
                    "annotations": []
                  }
                },
                "isFinalStep": true,
                "nextButtonShouldSubmit": true
              }
            ],
            "units": [
              {
                "url": "/shared/simple-graph-with-table/units/meters",
                "activity": null,
                "name": "meter",
                "abbreviation": "m",
                "pluralName": "meters"
              },
              {
                "url": "/shared/simple-graph-with-table/units/minutes",
                "activity": null,
                "name": "minute",
                "abbreviation": "m",
                "pluralName": "minutes"
              }
            ],
            "axes": [
              {
                "url": "/shared/simple-graph-with-table/axes/1",
                "units": "/shared/simple-graph-with-table/units/minutes",
                "min": 0,
                "max": 10,
                "nSteps": 10,
                "label": "Time"
              },
              {
                "url": "/shared/simple-graph-with-table/axes/2",
                "units": "/shared/simple-graph-with-table/units/meters",
                "min": 0,
                "max": 2000,
                "nSteps": 10,
                "label": "Position"
              }
            ],
            "responseTemplates": [
            ],
            "tags": [
            ],
            "variables": [
            ],
            "datadefs": [
              {
                "type": "UnorderedDataPoints",
                "records": [
                  {
                    "url": "/shared/simple-graph-with-table/datadefs/unordered-1",
                    "name": "unordered-1",
                    "activity": "/shared/simple-graph-with-table",
                    "xUnits": "/shared/simple-graph-with-table/units/minutes",
                    "xLabel": "Time",
                    "xShortLabel": "Time",
                    "yUnits": "/shared/simple-graph-with-table/units/meters",
                    "yLabel": "Position",
                    "yShortLabel": "Position",
                    "points": [[1,200], [2,400], [3,600]]
                  }
                ]
              }
            ],
            "annotations": []
          }
        integrationTestHelper.startApp()
        Smartgraphs.statechart.sendAction 'loadWindowsAuthoredActivityJSON'
        SC.RunLoop.end();

      it 'should display a graph pane and a table pane', ->
        expect(aSmartgraphPane).toExistNTimes(3)
        expect("#{aSmartgraphPane} svg").toBeVisible()
        expect("#{aTablePane}").toBeVisible()

      it 'should display a graph with the authored data', ->
        # data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data  // this will work when we use converter
        data = [[1,200], [2,400], [3,600]]
        expect("#{aSmartgraphPane} svg").toContainThePoints(data)

      it 'should display a table with the authored data', ->
        # data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data  // this will work when we use converter
        data = [[1,200], [2,400], [3,600]]
        expect("#{aTablePane}").toContainTheTableData(data)
