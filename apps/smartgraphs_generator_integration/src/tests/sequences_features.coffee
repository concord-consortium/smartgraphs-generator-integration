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
                },
                "correctAnswerPoint": [4, 800]
                "hints": [
                  {
                    "name": "1st wrong answer"
                    "text": "Look at the graph..."
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
                  {
                    "name": "2nd wrong answer"
                    "text": "In these two intervals...."
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


      describe 'when an incorrect point is clicked and check answer is clicked', ->

        beforeEach ->
          integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])
          integrationTestHelper.clickButton "Check My Answer"

        it 'should show the first range visual prompt', ->
          data = integrationTestHelper.graphData()
          highlightedPoints = data[0..2]
          expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints, "#ff0000"

        describe 'when an incorrect point is clicked again', ->

          beforeEach ->
            integrationTestHelper.clickPointAt("#{aSmartgraphPane} svg", [1, 200])
            integrationTestHelper.clickButton "Check My Answer"

          it 'should show the second two range visual prompts', ->
            data = integrationTestHelper.graphData()
            highlightedPoints1 = data[0..2]
            expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints1, "#00ff00"
            highlightedPoints2 = data[3..4]
            expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints2, "#0000ff"

  describe "when the authored content specifies a numeric sequence", ->

    describe "with one page", ->

      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity"
          "name": "Numeric Sequence"
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
                "type": "NumericSequence",
                "initialPrompt": "Enter the answer...",
                "correctAnswer": 800,
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
        expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Enter the answer..."

      it 'should have a Check Answer button which is disabled', ->
        expect("#{aSmartgraphPane}").toHaveTheButton "Check My Answer"
        expect("#{aSmartgraphPane}").toHaveTheDisabledButton "Check My Answer"

      describe 'when an incorrect answer is entered', ->

        beforeEach ->
          integrationTestHelper.typeTextIn(".dialog-text input", "100")

        it 'should enable the Check Answer button', ->
          expect("#{aSmartgraphPane}").toHaveTheEnabledButton "Check My Answer"

        it 'should show the first hint after the button is pressed', ->
          integrationTestHelper.clickButton "Check My Answer"
          expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Look at the graph..."

      describe 'when the correct answer is entered and the button is pressed', ->

        beforeEach ->
          integrationTestHelper.typeTextIn(".dialog-text input", "800")
          integrationTestHelper.clickButton "Check My Answer"

        it 'should show the final step', ->
          expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "Four minutes into her run ...."

    describe "with range visual prompts", ->

      beforeEach ->
        integrationTestHelper.startAppWithContent
          "type": "Activity"
          "name": "Numeric Sequence"
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
                "type": "NumericSequence"
                "initialPrompt": {
                  "text": "Click the point..."
                },
                "correctAnswer": 800
                "hints": [
                  {
                    "name": "1st wrong answer"
                    "text": "Look at the graph..."
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
                  {
                    "name": "2nd wrong answer"
                    "text": "In these two intervals...."
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


      describe 'when an incorrect answer is entered and check answer is clicked', ->

        beforeEach ->
          integrationTestHelper.typeTextIn(".dialog-text input", "100")
          integrationTestHelper.clickButton "Check My Answer"

        it 'should show the first range visual prompt after the button is pressed', ->
          data = integrationTestHelper.graphData()
          highlightedPoints = data[0..2]
          expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints, "#ff0000"

        describe 'when an incorrect answer is entered again', ->

          beforeEach ->
            integrationTestHelper.typeTextIn(".dialog-text input", "100")
            integrationTestHelper.clickButton "Check My Answer"

          it 'should show the second two range visual prompts after the button is pressed', ->
            data = integrationTestHelper.graphData()
            highlightedPoints1 = data[0..2]
            expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints1, "#00ff00"
            highlightedPoints2 = data[3..4]
            expect("#{aSmartgraphPane} svg").toHaveTheOverlay highlightedPoints2, "#0000ff"

  describe "when the authored content specifies a constructed response sequence", ->

    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Maria's Run"
        "pages": [
          {
            "type": "Page"
            "name": "Introduction"
            "text": "In this activity...."
            "panes": [
              {
                "type": "ImagePane"
                "name": "Shoes"
                "url": "http://smartgraphs.concord.org/static/smartgraphs/en/current/resources/images/walking_path.jpg"
                "license": "Creative Commons BY-NC-ND 2.0"
                "attribution": "image courtesy flickr user altopower"
              }
            ],
            "sequence": {
              "type": "ConstructedResponseSequence"
              "initialPrompt": "What is your name?"
              "initialContent": ""
            }
          },
          {
            "type": "Page"
            "name": "Introduction"
            "text": "In this activity...."
            "panes": [
              {
                "type": "ImagePane"
                "name": "Shoes"
                "url": "http://smartgraphs.concord.org/static/smartgraphs/en/current/resources/images/walking_path.jpg"
                "license": "Creative Commons BY-NC-ND 2.0"
                "attribution": "image courtesy flickr user altopower"
              }
            ],
            "sequence": {
              "type": "ConstructedResponseSequence"
              "initialPrompt": "What is your name, this time with initial content?"
              "initialContent": "My name is..."
            }
          }
        ]

    it 'should display the question in a dialog-text box', ->
      expect("#{aSmartgraphPane} .dialog-text").toHaveTheText "What is your name?"

    it 'should display an input field with placeholder text', ->
      expect("#{aSmartgraphPane} .dialog-text textarea[placeholder='Enter your answer here...']").toBeVisible()

    it 'should display a disabled Next button', ->
      expect('').toHaveTheDisabledButton "Next"

    describe "when some text is entered", ->

      beforeEach ->
        integrationTestHelper.typeTextIn ".dialog-text textarea", "test"

      it 'should display an enabled Next button', ->
        expect('').toHaveTheEnabledButton "Next"

      it 'should display the initial content in the next input field', ->
        integrationTestHelper.clickButton "Next"
        expect("#{aSmartgraphPane} .dialog-text textarea").toHaveTheText "My name is..."


