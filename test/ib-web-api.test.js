'use strict';

const expect = require('chai').expect;
const IB = require('../lib/ib-web-api');


describe('ib-trade-api', function () {
  describe('configure', function () {
    it('sets the configuration variables correctly', function () {
      const testConfig = {
        verbose: true,
        baseUrl: 'https://base.example.com',
      };
      const ib = new IB(testConfig);
      expect(ib.configuration).to.deep.equal(testConfig)
    });

  })
});
