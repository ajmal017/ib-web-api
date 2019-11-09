'use strict';

const request = require('request-promise');
const joinUrl = require('urljoin');

class Resource {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    /**
     * @param endpoint
     * @param queryParams
     * @param body
     * @param method
     * @return {Promise}
     */
    httpRequest(endpoint, queryParams, body, method) {
        return request({
            method: method || 'GET',
            uri: joinUrl(this.baseUrl, endpoint),
            qs: queryParams || {},
            headers: {
                'content-type': 'application/json',
                'User-Agent': 'Request-Promise'
            },
            body: body || undefined,
            json: true,
        });
    }
}
module.exports = Resource;