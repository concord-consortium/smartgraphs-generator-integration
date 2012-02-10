defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading sequences converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()

  describe "when the authored content specifies a multiple-choice sequence with sequential hints", ->
    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Multiple Choice With Sequential Hints"
        "pages": [
          "type": "Page"
          "name": "First Page"
          "text": "<p>This is an example page.</p>"
          "panes": []
          "sequence": 
            "type": "MultipleChoiceWithSequentialHintsSequence"
            "initialPrompt": "<p>Which of the following choices is choice \"B\"?</p>"
            "choices": [
              "Choice A"
              "Choice B"
              "Choice C"
            ]
            "correctAnswerIndex": 1
            "giveUp": {
              "text": "<p>Incorrect. The correct choice B is choice B.</p>"
            }
            "confirmCorrect": {
              "text": "<p>That's right. I wanted choice B, you gave it to me.</p>"
            }
            "hints": [
                "name": "Hint 1"
                "text": "<p>You can try harder than that.</p>"
              ,
                "name": "Hint 2"
                "text": "<p>I'm starting to worry about you.</p>"
            ]
        ]

    theDialogText = "#{aSmartgraphPane} .dialog-text"

    # helpers for repeated structure of tests
    afterChoosing = (choices..., test) ->
      for choice in choices
        describe "after clicking #{choice}", ->
          beforeEach ->
            integrationTestHelper.clickRadioButton choice

          it "should enable the \"Check My Answer\" button", ->
            expect(aSmartgraphPane).toHaveTheEnabledButton "Check My Answer"

          describe "after clicking the \"Check My Answer\" button", ->
            beforeEach ->
              integrationTestHelper.clickButton "Check My Answer"

            test()
      null
    
    itShouldBeAnswerable = ->
      it "should contain an (unselected) radio button labeled \"Choice A\"", ->
        expect(theDialogText).toHaveTheUnselectedRadioButton "Choice A"

      it "should contain an (unselected) radio button labeled \"Choice B\"", ->
        expect(theDialogText).toHaveTheUnselectedRadioButton "Choice B"
  
      it "should contain an (unselected) radio button labeled \"Choice C\"", ->
        expect(theDialogText).toHaveTheUnselectedRadioButton "Choice C"

      it "should have a disabled button \"Check My Answer\" button", ->
        expect(aSmartgraphPane).toHaveTheDisabledButton "Check My Answer"
        
    itShouldNotBeAnswerable = ->
      it "should not have any radio buttons", ->
        expect(theDialogText).not.toHaveRadioButtons()
      
      it "should not have a \"Check My Answer\" button", ->
        expect(theDialogText).not.toHaveTheButton "Check My Answer"
    
    itShouldDisplayConfirmationText = ->
      itShouldNotBeAnswerable()
      it "should display the confirmCorrect text", ->
        expect(theDialogText).toHaveTheText "<p>That's right. I wanted choice B, you gave it to me.</p>"
        
    itShouldDisplayGiveUpText = ->
      itShouldNotBeAnswerable()
      it "should display the giveUp text", ->
        expect(theDialogText).toHaveTheText "<p>Incorrect. The correct choice B is choice B.</p>"
              
    itShouldDisplayAnswerablePrompt = (promptText) ->
      itShouldBeAnswerable()
      it "should display the text, \"#{promptText}\"", ->
        expect(theDialogText).toHaveTheText promptText

    # the actual tests
    
    itShouldDisplayAnswerablePrompt "<p>Which of the following choices is choice \"B\"?</p>"
    afterChoosing "Choice B", itShouldDisplayConfirmationText
    afterChoosing "Choice A", "Choice C", ->
      itShouldDisplayAnswerablePrompt "<p>You can try harder than that.</p>"
      afterChoosing "Choice B", itShouldDisplayConfirmationText
      afterChoosing "Choice A", "Choice C", ->
        itShouldDisplayAnswerablePrompt "<p>I'm starting to worry about you.</p>"
        afterChoosing "Choice B", itShouldDisplayConfirmationText
        afterChoosing "Choice A", "Choice C", itShouldDisplayGiveUpText
