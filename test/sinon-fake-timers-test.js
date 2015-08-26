/*globals describe, it, beforeEach, afterEach */
'use strict';

var assert = require('assert');
var sinon = require('sinon');

describe('setTimeout', function () {

  function saySomethingDelayed(something, delay) {
    setTimeout(function () {
      window.alert(something);
    }, delay);
  }

  // Test without sinon fakeTimers (ugliness alert!)
  it('alerts delayed message', function (done) {
    sinon.stub(window, 'alert');

    saySomethingDelayed('beep boop', 500);

    setTimeout(function () {
      sinon.assert.calledOnce(window.alert);
      sinon.assert.calledWith(window.alert, 'beep boop');

      window.alert.restore();
      done();
    }, 500);
  });

  // Test with sinon fakeTimers
  it('alerts delayed message', function () {
    sinon.stub(window, 'alert');
    var clock = sinon.useFakeTimers();

    saySomethingDelayed('beep boop', 500);

    clock.tick(499);
    sinon.assert.notCalled(window.alert);

    clock.tick(1);
    sinon.assert.calledOnce(window.alert);
    sinon.assert.calledWith(window.alert, 'beep boop');

    window.alert.restore();
  });

  // Same as above, just optimized
  it('alerts delayed message', sinon.test(function () {
    this.stub(window, 'alert');

    saySomethingDelayed('beep boop', 500);

    this.clock.tick(500);
    sinon.assert.calledOnce(window.alert);
    sinon.assert.calledWith(window.alert, 'beep boop');
  }));
});

describe('Date now & getTime', function () {

  function getCurrentDay() {
    var d = new Date();
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  }

  it('gets name of current day', function () {
    var d = new Date(2015, 8, 2); // 2.9.2015, Wednesday
    var clock = sinon.useFakeTimers(d.getTime());

    assert.equal(getCurrentDay(), 'Wed');

    clock.tick(24 * 60 * 60 * 1000 - 1);
    assert.equal(getCurrentDay(), 'Wed');

    clock.tick(1);
    assert.equal(getCurrentDay(), 'Thu');

    clock.restore();
  });
});

describe('setInterval', function () {

  function repeat(interval, cb) {
    var counter = 0;
    setInterval(function () {
      cb(++counter);
    }, interval);
  }

  it('gets name of current day', sinon.test(function () {
    var spy = sinon.spy();

    repeat(500, spy);

    this.clock.tick(499);
    sinon.assert.notCalled(spy);

    this.clock.tick(1);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, 1);

    this.clock.tick(500);
    sinon.assert.calledTwice(spy);
    sinon.assert.calledWith(spy, 2);

    spy.reset();
    this.clock.tick(500);
    sinon.assert.calledOnce(spy);
  }));
});


