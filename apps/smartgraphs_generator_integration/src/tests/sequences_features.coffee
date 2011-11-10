defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading sequences converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()

  describe "when the authored content specifies an instruction sequence", ->

    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Instruction Sequence"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
            "text": "in this activity...."
            "panes": [
              {
                "type": "ImagePane"
                "name": "Shoes"
                "url": "http://smartgraphs.concord.org/static/smartgraphs/en/current/resources/images/walking_path.jpg"
                "license": "Creative Commons BY-NC-ND 2.0"
                "attribution": "image courtesy flickr user altopower"
              }
            ]
            "sequence": {
              "type": "InstructionSequence"
              "text": "Click the next button to get started"
            }
          }
        ]

    it 'should display the instruction text in a dialog-text box', ->
      expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Click the next button to get started"

  describe "when the authored content specifies a pick-a-point sequence", ->

    describe "with one page", ->

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
                  ]
                },
                {
                  "type": "TablePane"
                }
              ],
              "sequence": {
                "type": "PickAPointSequence",
                "initialPrompt": "Click the point...",
                "correctAnswerPoint": [4, 800],
                "hints": [
                  {
                    "name": "1st wrong answer",
                    "text": "Look at the graph..."
                  },
                  {
                    "name": "2nd wrong answer",
                    "text": "In these two intervals...."
                  }
                ],
                "giveUp": {
                  "text": "If you look carefully, ...."
                },
                "confirmCorrect": {
                  "text": "Four minutes into her run ...."
                }
              }
            }
          ]

      it 'should show the first step initially', ->
        expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Click the point..."

      it 'should have a Check Answer button which is disabled', ->
        expect("#{aSmartgraphPane}").toHaveTheButton "Check My Answer"
        expect("#{aSmartgraphPane}").toHaveTheDisabledButton "Check My Answer"

      describe 'when an incorrect point is clicked', ->

        beforeEach ->
          integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])

        it 'should enable the Check Answer button', ->
          expect("#{aSmartgraphPane}").toHaveTheEnabledButton "Check My Answer"

        it 'should show the first hint after the button is pressed', ->
          integrationTestHelper.clickButton "Check My Answer"
          expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Look at the graph..."

      describe 'when the correct point is clicked and the button is pressed', ->

        beforeEach ->
          integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [4, 800])
          integrationTestHelper.clickButton "Check My Answer"

        it 'should show the final step', ->
          expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Four minutes into her run ...."
