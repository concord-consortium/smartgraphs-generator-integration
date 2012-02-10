(function() {
  var __slice = Array.prototype.slice;

  defineJasmineHelpers();

  $(function() {
    return $('body').css('overflow', 'auto');
  });

  describe("The Smartgraphs runtime, when loading sequences converted from the authored format", function() {
    var aSmartgraphPane, afterChoosing, itShouldBeNonanswerable, itShouldHaveAnswerableChoices, itShouldHaveText, theDialogText;
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
    });
    aSmartgraphPane = '.smartgraph-pane';
    theDialogText = "" + aSmartgraphPane + " .dialog-text";
    afterChoosing = function() {
      var choice, choices, test, _i, _j, _len;
      choices = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), test = arguments[_i++];
      for (_j = 0, _len = choices.length; _j < _len; _j++) {
        choice = choices[_j];
        describe("after clicking " + choice, function() {
          beforeEach(function() {
            return integrationTestHelper.clickRadioButton(choice);
          });
          it("should enable the \"Check My Answer\" button", function() {
            return expect(aSmartgraphPane).toHaveTheEnabledButton("Check My Answer");
          });
          return describe("after clicking the \"Check My Answer\" button", function() {
            beforeEach(function() {
              return integrationTestHelper.clickButton("Check My Answer");
            });
            return test();
          });
        });
      }
      return null;
    };
    itShouldHaveAnswerableChoices = function() {
      var choice, choices, _i, _len;
      choices = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      it("should have a disabled button \"Check My Answer\" button", function() {
        return expect(aSmartgraphPane).toHaveTheDisabledButton("Check My Answer");
      });
      for (_i = 0, _len = choices.length; _i < _len; _i++) {
        choice = choices[_i];
        it("should contain an (unselected) radio button labeled \"" + choice + "\"", function() {
          return expect(theDialogText).toHaveTheUnselectedRadioButton(choice);
        });
      }
      return null;
    };
    itShouldBeNonanswerable = function() {
      it("should not have any radio buttons", function() {
        return expect(theDialogText).not.toHaveRadioButtons();
      });
      return it("should not have a \"Check My Answer\" button", function() {
        return expect(theDialogText).not.toHaveTheButton("Check My Answer");
      });
    };
    itShouldHaveText = function(text) {
      return it("should display the text, \"" + text + "\"", function() {
        return expect(theDialogText).toHaveTheText(text);
      });
    };
    describe("when the authored content specifies a multiple-choice sequence with sequential hints", function() {
      var itShouldBeAnswerable, itShouldDisplayAnswerablePrompt, itShouldDisplayConfirmationText, itShouldDisplayGiveUpText;
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Multiple Choice With Sequential Hints",
          "pages": [
            {
              "type": "Page",
              "name": "First Page",
              "text": "<p>This is an example page.</p>",
              "panes": [],
              "sequence": {
                "type": "MultipleChoiceWithSequentialHintsSequence",
                "initialPrompt": "<p>Which of the following choices is choice \"B\"?</p>",
                "choices": ["Choice A", "Choice B", "Choice C"],
                "correctAnswerIndex": 1,
                "giveUp": {
                  "text": "<p>Incorrect. The correct choice B is choice B.</p>"
                },
                "confirmCorrect": {
                  "text": "<p>That's right. I wanted choice B, you gave it to me.</p>"
                },
                "hints": [
                  {
                    "name": "Hint 1",
                    "text": "<p>You can try harder than that.</p>"
                  }, {
                    "name": "Hint 2",
                    "text": "<p>I'm starting to worry about you.</p>"
                  }
                ]
              }
            }
          ]
        });
      });
      itShouldBeAnswerable = function() {
        return itShouldHaveAnswerableChoices("Choice A", "Choice B", "Choice C");
      };
      itShouldDisplayAnswerablePrompt = function(text) {
        itShouldBeAnswerable();
        return itShouldHaveText(text);
      };
      itShouldDisplayConfirmationText = function() {
        itShouldBeNonanswerable;        return itShouldHaveText("<p>That's right. I wanted choice B, you gave it to me.</p>");
      };
      itShouldDisplayGiveUpText = function() {
        itShouldBeNonanswerable;        return itShouldHaveText("<p>Incorrect. The correct choice B is choice B.</p>");
      };
      itShouldDisplayAnswerablePrompt("<p>Which of the following choices is choice \"B\"?</p>");
      afterChoosing("Choice B", itShouldDisplayConfirmationText);
      return afterChoosing("Choice A", "Choice C", function() {
        itShouldDisplayAnswerablePrompt("<p>You can try harder than that.</p>");
        afterChoosing("Choice B", itShouldDisplayConfirmationText);
        return afterChoosing("Choice A", "Choice C", function() {
          itShouldDisplayAnswerablePrompt("<p>I'm starting to worry about you.</p>");
          afterChoosing("Choice B", itShouldDisplayConfirmationText);
          return afterChoosing("Choice A", "Choice C", itShouldDisplayGiveUpText);
        });
      });
    });
    return describe("when the authored content specifies a multiple choice sequence with custom hints", function() {
      var itShouldBeAnswerable, itShouldDisplayAnswerablePrompt, itShouldDisplayConfirmationText, itShouldRespondToChoiceAndThen;
      beforeEach(function() {
        return integrationTestHelper.startAppWithContent({
          "type": "Activity",
          "name": "Multiple Choice 2",
          "pages": [
            {
              "type": "Page",
              "name": "First Page",
              "text": "<p>This is an example page.</p>",
              "panes": [],
              "sequence": {
                "type": "MultipleChoiceWithCustomHintsSequence",
                "initialPrompt": "<p>Which of the following choices is choice \"B\"?</p>",
                "choices": ["Choice A", "Choice B", "Choice C"],
                "correctAnswerIndex": 1,
                "confirmCorrect": {
                  "text": "<p>That's right. I wanted choice B, you gave it to me.</p>"
                },
                "hints": [
                  {
                    "name": "Choice A Hint",
                    "choiceIndex": 0,
                    "text": "<p>Try to think of B, not A.</p>"
                  }, {
                    "name": "Choice C Hint",
                    "choiceIndex": 2,
                    "text": "<p>Now, really. C?</p>"
                  }
                ]
              }
            }
          ]
        });
      });
      itShouldBeAnswerable = function() {
        return itShouldHaveAnswerableChoices("Choice A", "Choice B", "Choice C");
      };
      itShouldDisplayAnswerablePrompt = function(text) {
        itShouldBeAnswerable();
        return itShouldHaveText(text);
      };
      itShouldDisplayConfirmationText = function() {
        itShouldBeNonanswerable;        return itShouldHaveText("<p>That's right. I wanted choice B, you gave it to me.</p>");
      };
      itShouldRespondToChoiceAndThen = function(test) {
        afterChoosing("Choice B", itShouldDisplayConfirmationText);
        afterChoosing("Choice A", function() {
          itShouldDisplayAnswerablePrompt("<p>Try to think of B, not A.</p>");
          return typeof test === "function" ? test() : void 0;
        });
        return afterChoosing("Choice C", function() {
          itShouldDisplayAnswerablePrompt("<p>Now, really. C?</p>");
          return typeof test === "function" ? test() : void 0;
        });
      };
      itShouldDisplayAnswerablePrompt("<p>Which of the following choices is choice \"B\"?</p>");
      return itShouldRespondToChoiceAndThen(function() {
        return itShouldRespondToChoiceAndThen(null);
      });
    });
  });

}).call(this);
