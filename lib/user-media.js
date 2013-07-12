define(function (require) {

  'use strict';

  var defineComponent = require('flight/lib/component');

  return defineComponent(userMedia);

  function userMedia(withFilters) {
    this.defaultAttrs({
      audio: false,
      video: false,
      selector: 'video',
      eventPrefix: 'user-media-',
      nativeEvents: ['abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspended', 'timeupdate', 'volumechange', 'waiting']
    });


    this.fallback = function (e) {
      this.trigger(this.attr.eventPrefix + 'not-supported');
    };

    this.success = function (stream) {
      this.$node.attr('src', window.URL.createObjectURL(stream));
      this.trigger(this.attr.eventPrefix + 'playing');
    };

    this.takeSnapshot = function (ev, data) {
      var canvas = this.tmpCanvas();

      canvas.width = this.select('selector')[0].clientWidth;
      canvas.height = this.select('selector')[0].clientHeight;
      canvas.getContext('2d').drawImage(this.select('selector')[0], 0, 0);

      this.trigger(this.attr.eventPrefix + 'snapshot-taken', {
        src: canvas.toDataURL('image/webp')
      });
    };

    this.tmpCanvas =  function () {
      if (!document.querySelector("#user-media-tmp-canvas")) {
        this.$node.append("<canvas id='user-media-tmp-canvas' style='display:none;'></canvas>");
      }
      return document.querySelector("#user-media-tmp-canvas");
    };

    this.ensureCrossBrowserCompatibility = function () {
      window.URL = window.URL || window.webkitURL;

      navigator.getUserMedia  = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
    };

    this.getUserMedia = function () {
      navigator.getUserMedia({audio: this.attr.audio, video: this.attr.video}, this.success.bind(this), this.fallback.bind(this));
      this.trigger(this.attr.eventPrefix + 'started');
    };

    this.triggerCustomEvent = function (ev) {
      this.trigger(this.attr.eventPrefix + ev.type);
    };

    this.respondToNeedEvent = function (ev) {
      this.trigger(ev.type.match(/[a-z]+$/));
    };

    this.after('initialize', function () {
      this.ensureCrossBrowserCompatibility();

      if (navigator.getUserMedia) {
        this.on(document, 'ui-' + this.attr.eventPrefix + 'needs-initialize', this.getUserMedia);
        this.on(document, 'ui-' + this.attr.eventPrefix + 'needs-snapshot', this.takeSnapshot);

        this.attr.nativeEvents.forEach(function (nativeEvent) {
          this.on(document, 'ui-' + this.attr.eventPrefix + 'needs-' + nativeEvent, this.respondToNeedEvent);
          this.on(nativeEvent, this.triggerCustomEvent);
        }.bind(this));
      } else {
        this.fallback();
      }
    });
  }
});
