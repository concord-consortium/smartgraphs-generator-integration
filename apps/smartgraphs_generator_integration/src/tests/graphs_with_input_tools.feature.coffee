defineJasmineHelpers()
$ -> $('body').css('overflow', 'auto')

describe "The Smartgraphs runtime, when loading graphs and tables converted from the authored format", ->

  aSmartgraphPane = '.smartgraph-pane'

  beforeEach ->
    integrationTestHelper.addMatchers this

  afterEach ->
    integrationTestHelper.teardownApp()

  describe "when the authored content specifies a SensorGraphPane", ->

    appletInstance = null
    graphView = null

    beforeEach ->
      graphView = Smartgraphs.activityPage.firstGraphPane.graphView

      appletInstance =
        startCollecting: ->
        stopCollecting: ->

      spyOn appletInstance, 'startCollecting'
      spyOn appletInstance, 'stopCollecting'

      spyOn(Smartgraphs.sensorAppletController, 'append').andCallFake (args) ->
        if args?.listenerPath then this.set 'listenerPath', args.listenerPath

      spyOn(Smartgraphs.sensorAppletController, 'get').andCallFake (prop) ->
        if prop is 'appletInstance'
          appletInstance
        else
          SC.Object.prototype.get.call this, prop

      integrationTestHelper.startAppWithContent
        "type": "Activity",
        "name": "Sensor Graph Activity",
        "pages": [
          {
            "type": "Page",
            "name": "Sensor graph page",
            "text": "In this activity, you'll walk back and forth in front of the sensor.",
            "panes": [
              {
                "type": "SensorGraphPane",
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
      expect("#{aSmartgraphPane} svg g rect").toExistNTimes 1

    it "should display the correct x units", ->
      expect("#{aSmartgraphPane} svg").toHaveTheText "Time (Time)"

    it "should display the correct y units", ->
      expect("#{aSmartgraphPane} svg").toHaveTheText "Position (Distance)"

    it "should not display any datapoints", ->
      expect("#{aSmartgraphPane} svg circle").toExistNTimes 0

    it "should request a sensor applet to be appended", ->
      expect(Smartgraphs.sensorAppletController.append).toHaveBeenCalled()


    describe "after the sensor applet indicates it is ready", ->

      listener = null

      beforeEach ->
        listener = SC.objectForPropertyPath Smartgraphs.sensorAppletController.get('listenerPath')
        listener.sensorsReady()

      it "should have an enabled Start button", ->
        expect(aSmartgraphPane).toHaveTheEnabledButton "Start"

      it "should have a disabled Stop button", ->
        expect(aSmartgraphPane).toHaveTheDisabledButton "Stop"

      it "should have a disabled Reset button", ->
        expect(aSmartgraphPane).toHaveTheDisabledButton "Reset"


      describe "and the Start button is clicked", ->
        beforeEach ->
          integrationTestHelper.clickButton "Start"

        it "should have a disabled Start button", ->
          expect(aSmartgraphPane).toHaveTheDisabledButton "Start"

        it "should have an enabled Stop button", ->
          expect(aSmartgraphPane).toHaveTheEnabledButton "Stop"

        it "should have a disabled Reset button", ->
          expect(aSmartgraphPane).toHaveTheDisabledButton "Reset"

        it "should have called the startCollecting method of the applet", ->
          expect(appletInstance.startCollecting).toHaveBeenCalled()


        describe "and the applet returns a data point at 1", ->
          beforeEach ->
            listener.dataReceived null, 1, [1]

          it "should contain exactly one datapoint", ->
            expect("#{aSmartgraphPane} svg circle").toExistNTimes 1

          it "should contain a data point at (0, 1)", ->
            {x, y} = graphView.coordinatesForPoint 0, 1
            expect("#{aSmartgraphPane} svg").toContainAPointAt x, y


          describe "and the Stop button is clicked", ->
            beforeEach ->
              integrationTestHelper.clickButton "Stop"

            it "should have a disabled Start button", ->
              expect(aSmartgraphPane).toHaveTheDisabledButton "Start"

            it "should have an disabled Stop button", ->
              expect(aSmartgraphPane).toHaveTheDisabledButton "Stop"

            it "should have an enabled Reset button", ->
              expect(aSmartgraphPane).toHaveTheEnabledButton "Reset"

            it "should have called the stopCollecting method of the applet", ->
              expect(appletInstance.stopCollecting).toHaveBeenCalled()

            it "should still contain exactly one datapoint", ->
              expect("#{aSmartgraphPane} svg circle").toExistNTimes 1

            it "should still contain a data point at (0, 1)", ->
              {x, y} = graphView.coordinatesForPoint 0, 1
              expect("#{aSmartgraphPane} svg").toContainAPointAt x, y


            describe "and the Reset button is clicked", ->
              beforeEach ->
                integrationTestHelper.clickButton "Reset"

              it "should have an enabled Start button", ->
                expect(aSmartgraphPane).toHaveTheEnabledButton "Start"

              it "should have a disabled Stop button", ->
                expect(aSmartgraphPane).toHaveTheDisabledButton "Stop"

              it "should have a disabled Reset button", ->
                expect(aSmartgraphPane).toHaveTheDisabledButton "Reset"

              it "should no longer display any datapoints", ->
                circle = $('svg circle')[0]
                # collectionViewFastPath caches removed collection view items in the DOM, but hidden
                expect(circle.style.display).toEqual 'none'
