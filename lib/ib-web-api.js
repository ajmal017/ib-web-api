'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const events = require('events');
const request = require('request-promise');
const joinUrl = require('urljoin');

// const websockets = require('./resources/websockets');

const STATE = {
    AUTHENTICATING: 'authenticating',
    AUTHENTICATED: 'authenticated'
};
const EVENT = {
    STATE_CHANGE: 'state change',
};
const ERROR = {
    UNAUTHORIZED_CLIENT: 'not authenticated client',
};

class IB extends events.EventEmitter {
    constructor(config = {}){
        super();
        this.configuration = {
            baseUrl: config.baseUrl || process.env.IB_API_BASE_URL || 'https://localhost:5000/v1/portal',
            // If true, client outputs detailed log messages
            verbose: true
        };
        // this.websocket = new websockets.IBStreamClient({
        //     url: this.configuration.baseUrl,
        // });
        // this.websocket.STATE = websockets.STATE;
        // this.websocket.EVENT = websockets.EVENT;
        // this.websocket.ERROR = websockets.ERROR;

        this.currentState = null;
        // Register internal event handlers
        // Log and emit every state change
        Object.keys(STATE).forEach(s => {
            this.on(STATE[s], () => {
                this.currentState = STATE[s]
                this._log('info', `state change: ${STATE[s]}`)
                this.emit(EVENT.STATE_CHANGE, STATE[s])
            })
        });

        this.session = new (require('./resources/session'))(this);
        this.account = new (require('./resources/account'))(this);
        this.contract = new (require('./resources/contract'))(this);
        this.market = new (require('./resources/market'))(this);
    }

    httpRequest(endpoint, queryParams, body, method) {
        const { baseUrl } = this.configuration;
        return request({
            method: method || 'GET',
            uri: joinUrl(baseUrl, endpoint),
            qs: queryParams || {},
            headers: {
                'content-type': 'application/json',
                'User-Agent': 'Request-Promise'
            },
            body: body || undefined,
            json: true,
        });
    }

    authenticate(){
        this.emit(STATE.AUTHENTICATING);
        let me = this,
            session = this.session;
        session.status().then((status) => {
            this._checkConnection(status);
        }).catch(function (err) {
            if(err.name === 'StatusCodeError' && err.statusCode === 401){
                session.reauthenticate().then((status) => {
                    me._checkConnection(status);
                }).catch(function (err) {
                    console.log(err)
                });
            } else
                console.log(err)
        });
    };

    onAuthenticated(fn) {
        this.on(STATE.AUTHENTICATED, () => fn())
    }

    _checkConnection(status){
        if(this.session._isConnected(status))
            this.emit(STATE.AUTHENTICATED);
        else {
            this.emit(ERROR.UNAUTHORIZED_CLIENT);
            console.log('Not authenticated client. To authenticate the gateway session with your account, go to https://localhost:5000/ ');
        }
    }

    _log(level, ...msg) {
        if (this.configuration.verbose) {
            console[level](...msg)
        }
    }
}

module.exports = IB;