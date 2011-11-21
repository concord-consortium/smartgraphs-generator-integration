defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading graph annotations converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()

  describe "with range visual prompts", ->

    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Pick A Point Sequence"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
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
                  [4,800]
                  [5,1000]
                ]
              },
              {
                "type": "TablePane"
              }
            ],
            "sequence": {
              "type": "PickAPointSequence"
              "initialPrompt": {
                "text": "Click the point..."
                "visualPrompts": [
                  {
                    "type": "RangeVisualPrompt"
                    "name": "1 to 3"
                    "xMin": 1
                    "xMax": 3
                    "color": "#ff0000"
                  }
                ]
              },
              "correctAnswerPoint": [4, 800]
              "hints": [],
              "giveUp": {
                "text": "If you look carefully, ...."
                "visualPrompts": [
                  {
                    "type": "RangeVisualPrompt"
                    "name": "Unbounded left"
                    "xMax": 3,
                    "color": "#00ff00"
                  },
                  {
                    "type": "RangeVisualPrompt"
                    "name": "Unbounded right"
                    "xMin": 4
                    "color": "#0000ff"
                  }
                ]
              },
              "confirmCorrect": {
                "text": "Four minutes into her run ...."
              }
            }
          }
        ]


    describe 'when the initial step is loaded', ->

      it 'should show the first range visual prompt', ->
        data = integrationTestHelper.graphData()
        highlightedPoints = data[0..2]
        expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints, "#ff0000"

    describe 'when an incorrect point is clicked', ->

      beforeEach ->
        integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])
        integrationTestHelper.clickButton "Check My Answer"

      it 'should show the two give-up range visual prompts', ->
        data = integrationTestHelper.graphData()
        highlightedPoints1 = data[0..2]
        expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints1, "#00ff00"
        highlightedPoints2 = data[3..4]
        expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints2, "#0000ff"


  describe "with circled-point visual prompts", ->

    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Pick A Point Sequence"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
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
                  [4,800]
                  [5,1000]
                ]
              },
              {
                "type": "TablePane"
              }
            ],
            "sequence": {
              "type": "PickAPointSequence"
              "initialPrompt": {
                "text": "Click the point..."
                "visualPrompts": [
                  {
                    "type": "PointCircleVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      4,
                      800
                    ],
                    "color": "red"
                  }
                ]
              },
              "correctAnswerPoint": [4, 800]
              "hints": [],
              "giveUp": {
                "text": "If you look carefully, ...."
                "visualPrompts": [
                  {
                    "type": "PointCircleVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      3,
                      600
                    ],
                    "color": "#00ff00"
                  },
                  {
                    "type": "PointCircleVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      5,
                      1000
                    ],
                    "color": "blue"
                  }
                ]
              },
              "confirmCorrect": {
                "text": "Four minutes into her run ...."
              }
            }
          }
        ]


    describe 'when the initial step is loaded', ->

      it 'should show the first range visual prompt', ->
        expect("#{aSmartgraphPane} svg").toHaveTheCircledPoint [4,800], "#ff0000"

    describe 'when an incorrect point is clicked', ->

      beforeEach ->
        integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])
        integrationTestHelper.clickButton "Check My Answer"

      it 'should show the two give-up range visual prompts', ->
          expect("#{aSmartgraphPane} svg").toHaveTheCircledPoint [3,600], "#00ff00"
          expect("#{aSmartgraphPane} svg").toHaveTheCircledPoint [5,1000], "#0000ff"

  describe "with line-to-axis visual prompts", ->

    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Pick A Point Sequence"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
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
                  [4,800]
                  [5,1000]
                ]
              },
              {
                "type": "TablePane"
              }
            ],
            "sequence": {
              "type": "PickAPointSequence"
              "initialPrompt": {
                "text": "Click the point..."
                "visualPrompts": [
                  {
                    "type": "PointAxisLineVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      4,
                      800
                    ],
                    "color": "green",
                    "axis": "x_axis"
                  }
                ]
              },
              "correctAnswerPoint": [4, 800]
              "hints": [],
              "giveUp": {
                "text": "If you look carefully, ...."
                "visualPrompts": [
                  {
                    "type": "PointAxisLineVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      3,
                      600
                    ],
                    "color": "#00ff00",
                    "axis": "y_axis"
                  },
                  {
                    "type": "PointAxisLineVisualPrompt",
                    "name": "1 to 2",
                    "point": [
                      5,
                      1000
                    ],
                    "color": "blue",
                    "axis": "x_axis"
                  }
                ]
              },
              "confirmCorrect": {
                "text": "Four minutes into her run ...."
              }
            }
          }
        ]


    describe 'when the initial step is loaded', ->

      it 'should show the first range visual prompt', ->
        expect("#{aSmartgraphPane} svg").toHaveALineToAxis [4,800], "x", "#ff0000"

    describe 'when an incorrect point is clicked', ->

      beforeEach ->
        integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])
        integrationTestHelper.clickButton "Check My Answer"

      it 'should show the two give-up range visual prompts', ->
          expect("#{aSmartgraphPane} svg").toHaveALineToAxis [3,600], "y", "#00ff00"
          expect("#{aSmartgraphPane} svg").toHaveALineToAxis [5,1000], "x", "#0000ff"