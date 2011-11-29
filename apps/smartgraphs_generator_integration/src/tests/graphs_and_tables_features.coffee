defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading graphs and tables converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()

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
        data = integrationTestHelper.graphData()
        for [dataX, dataY] in data
          {x, y} = coords = graphView.coordinatesForPoint dataX, dataY
          expect("#{aSmartgraphPane} svg").toContainAPointAt(x, y)

    describe "with no units", ->
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
                  "yMin": 0
                  "yMax": 2000
                  "yTicks": 10
                  "xLabel": "Time"
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
          "units": []

      it "should display a graph with no units", ->
        expect("#{aSmartgraphPane} svg").toHaveTheText("Position")
        expect("#{aSmartgraphPane} svg").toHaveTheText("Time")

  describe "when the authored content specifies a table", ->

    aTablePane = "#{aSmartgraphPane} .smartgraph-table"

    describe "with attached graph", ->
      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity"
          "name": "Graph and Table"
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
                },
                {
                  "type": "TablePane"
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

      it 'should display a graph pane and a table pane', ->
        expect(aSmartgraphPane).toExistNTimes(3)
        expect("#{aSmartgraphPane} svg").toBeVisible()
        expect("#{aTablePane}").toBeVisible()

      it 'should display a table with the authored headings', ->
        expect(aTablePane).toHaveTheText("Time (m)")
        expect(aTablePane).toHaveTheText("Position (m)")

      it 'should display a table with the authored data', ->
        data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data
        expect("#{aTablePane}").toContainTheTableData(data)

      it 'should display a graph with the authored data', ->
        expect("#{aTablePane} .table-column").toExistNTimes(2)
        data = integrationTestHelper.get('authoredContent').pages[0].panes[0].data
        expect("#{aSmartgraphPane} svg").toContainThePoints(data)

  describe "when the authored content specifies a prediction graph", ->

    describe "on a single pane", ->
      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity",
          "name": "Prediction Graph Activity",
          "pages": [
            {
              "type": "Page",
              "name": "Prediction graph page",
              "text": "In this activity, you'll make a prediction",
              "panes": [
                {
                  "type": "PredictionGraphPane",
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
            },
            {
              "type": "Unit",
              "name": "Distance",
              "abbreviation": "m"
            }
          ]


      it "should display a pane with an svg graph background", ->
        expect("#{aSmartgraphPane} svg").toBeVisible()
        expect("#{aSmartgraphPane} svg g rect").toExistNTimes(1)

      it "should display a disabled 'Reset' button", ->
        expect("#{aSmartgraphPane}").toHaveTheDisabledButton "Reset"

      # it "should be able to draw on the graph", ->    # Hard to test. Necessary?


    describe "on two panes", ->
      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity",
          "name": "Prediction Graph 2-Step Activity",
          "pages": [
            {
              "type": "Page",
              "name": "Prediction graph 2-step page",
              "text": "In this activity, you'll make two predictions, one after the other",
              "panes": [
                {
                  "type": "PredictionGraphPane",
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
                  "xTicks": 10.0,
                  "predictionType": "continuous_curves"
                },
                {
                  "type": "PredictionGraphPane",
                  "title": "Back and Forth 2",
                  "yLabel": "Position",
                  "yUnits": "Distance",
                  "yMin": 0.0,
                  "yMax": 5.0,
                  "xLabel": "Time",
                  "xUnits": "Time",
                  "xMin": 0.0,
                  "xMax": 20.0,
                  "yTicks": 10.0,
                  "xTicks": 10.0,
                  "predictionType": "continuous_curves"
                }
              ]
            }
          ],
          "units": [
            {
              "type": "Unit",
              "name": "Time",
              "abbreviation": "s"
            },
            {
              "type": "Unit",
              "name": "Distance",
              "abbreviation": "m"
            }
          ]


      it "should display two panes with svg graph backgrounds", ->
        expect("#{aSmartgraphPane} svg g rect").toExistNTimes(2)

      it "should display a disabled 'Reset' button", ->
        expect("#{aSmartgraphPane}").toHaveTheDisabledButton "Reset"

      # it "should be able to draw on the graph", ->    # FIXME: We need this to confirm the two-step sequence

