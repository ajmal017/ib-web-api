'use strict';

class Session extends (require('./resource')) {

    validate() {
        return this.httpRequest('/sso/validate');
    }

    status() {
        return this.httpRequest('/iserver/auth/status');
    }

    reauthenticate() {
        return this.httpRequest('/iserver/reauthenticate');
    }
}

module.exports = Session;