# flight-user-media

A [Flight](https://github.com/flightjs/flight) component for HTML5[getUserMedia](https://developer.mozilla.org/en-US/docs/WebRTC/navigator.getUserMedia)

## Installation

```bash
bower install --save flight-user-media
```

## Example


### Attach it

```javascript
userMedia.attachTo('video', {
  video: true,
  audio: false
});
```

### Interact with it

```javascript
define(function (require) {

  'use strict';

  var defineComponent = require('flight/lib/component');

  return defineComponent(myComponent);

  this.fallback = function (ev) {
    useFlashWebcam();
  };

  this.triggerPause = function (ev) {
    this.trigger('ui-user-media-needs-pause');
  };

  this.triggerSnapshot = function (ev) {
    this.trigger('ui-user-media-needs-snapshot');
  };

  this.switchToPauseState = function (ev) {
    console.log('I am in pause state');
  }

  function myComponent() {
    this.after('initialize', function () {
      this.on('click', this.triggerPlay);
      this.on(this.attr.snapshotTriggerSelector, 'click', this.triggerSnapshot);
      this.on('user-media-not-supported', this.fallback);

      this.on(document, 'user-media-pause', this.switchToPauseState);
      this.on(document, 'user-media-snapshot-taken', this.displaySnapshot);
  });
}
```

### Native and custom events

For each of the native event a `user-media-NATIVE_EVENT` will be triggered

To interact with it you can trigger the `ui-user-media-needs-NATIVE_EVENT` events, `ui-user-media-needs-play`, `ui-user-media-needs-pause`, etc.

[See all native events](http://www.w3schools.com/tags/ref_av_dom.asp)

### Take snapshots

Yo request an snapshot simply trigger `ui-user-media-needs-snapshot` and lisent to `user-media-snapshot-taken` which will have a `{ src: 'path/to/file'}`  in the event data.

## Development

Development of this component requires [Bower](http://bower.io), and preferably
[Karma](http://karma-runner.github.io) to be globally installed:

```bash
npm install -g bower karma
```

Then install the Node.js and client-side dependencies by running the following
commands in the repo's root directory.

```bash
npm install
bower install
```

To continuously run the tests in Chrome and Firefox during development, just run:

```bash
karma start
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
