defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading sequences converted from the authored format", ->
  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()
    
  aSmartgraphPane = '.smartgraph-pane'
  theDialogText = "#{aSmartgraphPane} .dialog-text"  

  # helpers
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
    
  itShouldHaveAnswerableChoices = (choices...) ->
    it "should have a disabled button \"Check My Answer\" button", ->
      expect(aSmartgraphPane).toHaveTheDisabledButton "Check My Answer"
      
    for choice in choices       
      it "should contain an (unselected) radio button labeled \"#{choice}\"", ->
        expect(theDialogText).toHaveTheUnselectedRadioButton choice
    null
      
  itShouldBeNonanswerable = ->
    it "should not have any radio buttons", ->
      expect(theDialogText).not.toHaveRadioButtons()
      
    it "should not have a \"Check My Answer\" button", ->
      expect(theDialogText).not.toHaveTheButton "Check My Answer"

  itShouldHaveText = (text) ->
    it "should display the text, \"#{text}\"", ->
      expect(theDialogText).toHaveTheText text
  
  # the actual scenarios being tested       
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
            "giveUp":
              "text": "<p>Incorrect. The correct choice B is choice B.</p>"
            "confirmCorrect":
              "text": "<p>That's right. I wanted choice B, you gave it to me.</p>"
            "hints": [
                "name": "Hint 1"
                "text": "<p>You can try harder than that.</p>"
              ,
                "name": "Hint 2"
                "text": "<p>I'm starting to worry about you.</p>"
            ]
        ]

    # helpers for this describe
    itShouldBeAnswerable = ->
      itShouldHaveAnswerableChoices "Choice A", "Choice B", "Choice C"

    itShouldDisplayAnswerablePrompt = (text) ->
      itShouldBeAnswerable()
      itShouldHaveText text
      
    itShouldDisplayConfirmationText = ->
      itShouldBeNonanswerable
      itShouldHaveText "<p>That's right. I wanted choice B, you gave it to me.</p>"
        
    itShouldDisplayGiveUpText = ->
      itShouldBeNonanswerable
      itShouldHaveText "<p>Incorrect. The correct choice B is choice B.</p>"

    # the actual tests for this describe
    itShouldDisplayAnswerablePrompt "<p>Which of the following choices is choice \"B\"?</p>"
    afterChoosing "Choice B", itShouldDisplayConfirmationText
    afterChoosing "Choice A", "Choice C", ->
      itShouldDisplayAnswerablePrompt "<p>You can try harder than that.</p>"
      afterChoosing "Choice B", itShouldDisplayConfirmationText
      afterChoosing "Choice A", "Choice C", ->
        itShouldDisplayAnswerablePrompt "<p>I'm starting to worry about you.</p>"
        afterChoosing "Choice B", itShouldDisplayConfirmationText
        afterChoosing "Choice A", "Choice C", itShouldDisplayGiveUpText
        
        
  describe "when the authored content specifies a multiple choice sequence with custom hints", ->
    beforeEach ->
      integrationTestHelper.startAppWithContent
        "type": "Activity"
        "name": "Multiple Choice 2"
        "pages": [
          "type": "Page"
          "name": "First Page"
          "text": "<p>This is an example page.</p>"
          "panes": []
          "sequence":
            "type": "MultipleChoiceWithCustomHintsSequence"
            "initialPrompt": "<p>Which of the following choices is choice \"B\"?</p>"
            "choices": [
              "Choice A"
              "Choice B"
              "Choice C"
            ]
            "correctAnswerIndex": 1
            "confirmCorrect":
              "text": "<p>That's right. I wanted choice B, you gave it to me.</p>"
            "hints": [
                "name": "Choice A Hint"
                "choiceIndex": 0
                "text": "<p>Try to think of B, not A.</p>"
              ,
                "name": "Choice C Hint"
                "choiceIndex": 2
                "text": "<p>Now, really. C?</p>"
            ]
        ]
        
    # helpers for this describe
    itShouldBeAnswerable = ->
      itShouldHaveAnswerableChoices "Choice A", "Choice B", "Choice C"

    itShouldDisplayAnswerablePrompt = (text) ->
      itShouldBeAnswerable()
      itShouldHaveText text

    itShouldDisplayConfirmationText = ->
      itShouldBeNonanswerable
      itShouldHaveText "<p>That's right. I wanted choice B, you gave it to me.</p>"
    
    itShouldResponseToChoiceAndThen = (test) ->
      afterChoosing "Choice B", itShouldDisplayConfirmationText
      afterChoosing "Choice A", ->
        itShouldDisplayAnswerablePrompt "<p>Try to think of B, not A.</p>"
        test?()     
      afterChoosing "Choice C", ->
        itShouldDisplayAnswerablePrompt "<p>Now, really. C?</p>"
        test?()

    # the actual tests for this describe
    itShouldDisplayAnswerablePrompt "<p>Which of the following choices is choice \"B\"?</p>"
    itShouldResponseToChoiceAndThen -> itShouldResponseToChoiceAndThen(null)
            