(function() {
  var __slice = Array.prototype.slice;

  defineJasmineHelpers();

  $(function() {
    return $('body').css('overflow', 'auto');
  });

  describe("The Smartgraphs runtime, when loading sequences converted from the authored format", function() {
    var aSmartgraphPane;
    aSmartgraphPane = '.smartgraph-pane';
    beforeEach(function() {
      return integrationTestHelper.addMatchers(this);
    });
    afterEach(function() {
      return integrationTestHelper.teardownApp();
    });
    return describe("when the authored content specifies a multiple-choice sequence with sequential hints", function() {
      var afterChoosing, itShouldBeAnswerable, itShouldDisplayAnswerablePrompt, itShouldDisplayConfirmationText, itShouldDisplayGiveUpText, itShouldNotBeAnswerable, theDialogText;
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
      itShouldBeAnswerable = function() {
        it("should contain an (unselected) radio button labeled \"Choice A\"", function() {
          return expect(theDialogText).toHaveTheUnselectedRadioButton("Choice A");
        });
        it("should contain an (unselected) radio button labeled \"Choice B\"", function() {
          return expect(theDialogText).toHaveTheUnselectedRadioButton("Choice B");
        });
        it("should contain an (unselected) radio button labeled \"Choice C\"", function() {
          return expect(theDialogText).toHaveTheUnselectedRadioButton("Choice C");
        });
        return it("should have a disabled button \"Check My Answer\" button", function() {
          return expect(aSmartgraphPane).toHaveTheDisabledButton("Check My Answer");
        });
      };
      itShouldNotBeAnswerable = function() {
        it("should not have any radio buttons", function() {
          return expect(theDialogText).not.toHaveRadioButtons();
        });
        return it("should not have a \"Check My Answer\" button", function() {
          return expect(theDialogText).not.toHaveTheButton("Check My Answer");
        });
      };
      itShouldDisplayConfirmationText = function() {
        itShouldNotBeAnswerable();
        return it("should display the confirmCorrect text", function() {
          return expect(theDialogText).toHaveTheText("<p>That's right. I wanted choice B, you gave it to me.</p>");
        });
      };
      itShouldDisplayGiveUpText = function() {
        itShouldNotBeAnswerable();
        return it("should display the giveUp text", function() {
          return expect(theDialogText).toHaveTheText("<p>Incorrect. The correct choice B is choice B.</p>");
        });
      };
      itShouldDisplayAnswerablePrompt = function(promptText) {
        itShouldBeAnswerable();
        return it("should display the text, \"" + promptText + "\"", function() {
          return expect(theDialogText).toHaveTheText(promptText);
        });
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
  });

}).call(this);
