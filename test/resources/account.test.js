'use strict';

const expect = require('chai').expect;
const mock = require('../support/mock-server');
const IB = require('../../lib/ib-web-api');
const ib = new IB(mock.getConfig());

describe('account resource', function () {

  describe('accounts', function () {
    it('returns valid results', async function () {
      const account = await ib.account.accounts();
      expect(account).to.have.property('id')
    })
  });

  describe('info', function () {
    it('returns 404 error if unknown account id is used', async function () {
      const id = 'ABCD123';
      const account = await ib.account.meta(id);
      expect(account).to.have.property('accountId')
    })
  });

  describe('summary', function () {
    it('returns 404 error if unknown account id is used', async function () {
      const id = 'ABCD123';
      const account = await ib.account.meta(id);
      expect(account).to.have.property('accountId')
    })
  });

});
