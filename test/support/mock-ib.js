'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const joi = require('joi');
const { apiMethod, assertSchema, apiError } = require('./assertions');

/**
 * This server mocks http methods from the ib api and returns 200 if the requests are formed correctly.
 * Some endpoints might allow you to pass "cheat code" values to trigger specific responses.
 *
 * This only exports a router, the actual server is created by mock-server.js
 */

module.exports = function createIBMock() {
  const v1 = express.Router().use(bodyParser.json());

  v1.get('/portfolio/accounts', apiMethod(() => accountEntity));

  v1.get('/portfolio/:accountId/meta', apiMethod((req) => {
    assertSchema(req.params, {
      accountId: joi.string().required()
    });
    return accountEntity
  }));

  v1.get('/portfolio/:accountId/summary', apiMethod((req) => {
    assertSchema(req.params, {
      accountId: joi.string().required()
    });
    return accountEntity
  }));


  v1.use(apiMethod(() => {
    throw apiError(404, 'route not found')
  }));

  return express.Router().use('/portal', v1)
};

const accountEntity = {
  "id": "string",
  "accountId": "ABCD123",
  "accountVan": "string",
  "accountTitle": "string",
  "displayName": "string",
  "accountAlias": "string",
  "accountStatus": 0,
  "currency": "string",
  "type": "string",
  "tradingType": "string",
  "faclient": true,
  "parent": "string",
  "desc": "string",
  "covestor": true,
  "master": {
    "title": "string",
    "officialTitle": "string"
  }
};
