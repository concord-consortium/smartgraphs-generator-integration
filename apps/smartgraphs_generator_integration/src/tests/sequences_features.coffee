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
