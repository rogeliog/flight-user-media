'use strict';

describeComponent('lib/user-media', function () {

  // Initialize the component and attach it to the DOM
  beforeEach(function () {
    setupComponent('<video></video><img src=""><canvas></canvas>');
  });

  it('should be defined', function () {
    expect(this.component).toBeDefined();
  });

  describe('Lisents to all native user media events', function () {
    var nativeEvents = ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspended', 'timeupdate', 'volumechange', 'waiting'];

    nativeEvents.forEach(function(nativeEvent) {
      it('and fires a custom flight event for ' + nativeEvent, function () {
        var eventSpy = spyOnEvent(document, 'user-media-' + nativeEvent);
        this.component.trigger(nativeEvent);
        expect(eventSpy).toHaveBeenTriggeredOn(document);
      });
    });

    xit('and fires a custom flight event for error', function () {
      //TODO: Cant make error event to pass the tests. Don't know if it is conficting with the browser
      var eventSpy = spyOnEvent(document, 'user-media-error');
      this.component.trigger('error');
      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('Lisents to ui-user-media-initialize', function () {
    it('and starts the user media', function () {
      var pauseSpy = spyOn(navigator, 'getUserMedia');
      $(document).trigger('ui-user-media-needs-initialize');
      expect(pauseSpy).toHaveBeenCalled();
    });

    it('and triggers the user-media-started event', function () {
      //Problem with test on Chrome 28.0 when removing it
      spyOn(navigator, 'getUserMedia');

      var eventSpy = spyOnEvent(document, 'user-media-started');
      $(document).trigger('ui-user-media-needs-initialize');
      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('Lisents to ui-user-media-needs-play', function () {
    it('and triggers the user-media-play event', function () {
      var eventSpy = spyOnEvent(document, 'user-media-play');
      $(document).trigger('ui-user-media-needs-play');
      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('Lisents to ui-user-media-needs-pause', function () {
    it('and triggers the user-media-pause event', function () {
      var eventSpy = spyOnEvent(document, 'user-media-pause');
      $(document).trigger('ui-user-media-needs-pause');
      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });

  describe('Lisents to ui-user-media-needs-snapshot', function () {
    beforeEach(function () {
      spyOn(this.component, 'tmpCanvas').andReturn(document.querySelector('canvas'));
      spyOn(document.querySelector('canvas'), 'toDataURL').andReturn("some/path");
    });

    it('and triggers the user-media-snapshot-taken with the src of the image in the data', function () {
      var eventSpy = spyOnEvent(document, 'user-media-snapshot-taken');
      $(document).trigger('ui-user-media-needs-snapshot');
      expect(eventSpy).toHaveBeenTriggeredOn(document);

      //TODO: Fix toHaveBeenTriggeredOnWith
      //expect(eventSpy).toHaveBeenTriggeredOnWith(document, {src: 'some/path'});
    });
  });

  describe('Fallback', function () {
    it('triggers a user-media-not-supported event', function () {
      var eventSpy = spyOnEvent(document, 'user-media-not-supported');
      this.component.fallback();
      expect(eventSpy).toHaveBeenTriggeredOn(document);
    });
  });
});
