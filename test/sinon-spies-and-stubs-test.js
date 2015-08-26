/*globals describe, it, beforeEach, afterEach */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var $ = require('jquery');

describe('anonymous spies', function () {

  function myFunc(condition, cb) {
    if (condition) {
      cb(undefined, { data: 'Hello World'});
    } else {
      cb({ code: 1, msg: 'there was an error' });
    }
  }

  it('executes callback with truthy condition', function () {
    var spy = sinon.spy();

    myFunc(true, spy);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWithMatch(spy, undefined, {});
  });

  it('executes callback with falsy condition', function () {
    var spy = sinon.spy();

    myFunc(false, spy);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, { code: 1, msg: 'there was an error' });
    sinon.assert.calledWith(spy, sinon.match.object);
  });

});

describe('spying on existing methods', function () {

  var myApp = {
    myMethod: function () {
      return 'hello world';
    },
    logSomething: function () {
      console.log('something');
    }
  };

  function myFunc() {
    myApp.myMethod();
  }

  it('executes myApp.myMethod', sinon.test(function () {
    this.spy(myApp, 'myMethod');

    myFunc();

    sinon.assert.calledOnce(myApp.myMethod);
    assert.equal(myApp.myMethod.firstCall.returnValue, 'hello world');
  }));

  it('executes console.log', sinon.test(function () {
    this.stub(console, 'log');

    myApp.logSomething();

    sinon.assert.calledOnce(console.log);
    sinon.assert.calledWith(console.log, 'something');
  }));

});

describe('stubbing', function () {

  var fakeData = {
    coord: {
      lon: 8.63,
      lat: 47.7
    },
    weather: [{
      id: 800,
      main: "Clear",
      description: "Sky is Clear",
      icon: "01n"
    }],
    base: "stations",
    main: {
      temp: 291.39,
      pressure: 1016,
      humidity: 82,
      temp_min: 288.15,
      temp_max: 294.82
    },
    visibility: 10000,
    wind: {
      speed: 1,
      deg: 70
    },
    clouds: {
      all: 0
    },
    dt: 1440621396,
    sys: {
      type: 1,
      id: 4915,
      message: 0.0164,
      country: "CH",
      sunrise: 1440563780,
      sunset: 1440613021
    },
    id: 2658761,
    name: "Schaffhausen",
    cod: 200
  };


  // weather map api cities
  var locations = [{
    name: 'Bern',
    id: 7285212
  }, {
    name: 'Rapperswil-Jona',
    id: 7286859
  }, {
    name: 'Schaffhausen',
    id: 7521936
  }, {
    name: 'Zurich',
    id: 2657896
  }];

  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather';

  function getLocationId(name) {
    return locations.filter(function (location) {
      return location.name === name.trim();
    })[0].id;
  }
  function getCurrentWeather(id, cb) {
    $.get(apiUrl + '?id=' + id, function (data) {
      cb(data);
    });
  }

  it('gets weather data for location id', sinon.test(function () {
    var spy = sinon.spy();
    var id = getLocationId('Schaffhausen');
    this.stub($, 'get');
    $.get.withArgs(apiUrl + '?id=7521936').yields(fakeData);

    getCurrentWeather(id, spy);

    sinon.assert.calledOnce($.get);
    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, fakeData);
  }));
});





