'use strict';

class Session {
    constructor(client){
        this.client = client;
    }
    validate() {
        return this.client.httpRequest('/sso/validate');
    }

    status() {
        return this.client.httpRequest('/iserver/auth/status');
    }

    reauthenticate() {
        return this.client.httpRequest('/iserver/reauthenticate');
    }

    _isConnected(status){
        return status.connected === true && status.authenticated === true;
    }
}


module.exports = Session;