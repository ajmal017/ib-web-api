'use strict';

const express = require('express');
const mockIB = require('./mock-ib');
const { apiError, apiMethod } = require('./assertions');

/**
 * This server mocks http methods from the ib api and returns 200 if the requests are formed correctly.
 * Some endpoints might allow you to pass "cheat code" values to trigger specific responses.
 */

const PORT = process.env.TEST_PORT || 3333;

function createIBMock({ port = PORT } = {}) {
  const app = express()
    .use('/v1', mockIB());
    // .use('/data', mockData())

  // app.use(apiMethod(() => {
  //   throw apiError(404, 'route not found')
  // }));

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      message: err.message
    });
  });

  return new Promise(resolve => {
    const server = app.listen(port, () => resolve(server))
  })
}

// promise of a mock ib server
let serverPromise = null;

const start = () => {
  if (!serverPromise) serverPromise = createIBMock();
  return serverPromise
};

const stop = () => {
  if (!serverPromise) return Promise.resolve();
  return serverPromise.then((server) =>
    new Promise(resolve => server.close(resolve))
  )
  .then(() => {
    serverPromise = null
  })
};

const getConfig = () => ({
  baseUrl: `http://localhost:${PORT}/v1/portal`,
  verbose: true
});


module.exports = {
  start, stop, getConfig
};
