const events = require('events');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const STATE = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected'
};
const EVENT = {
    STATE_CHANGE: 'state change',
};
const ERROR = {
    UNAUTHORIZED_CLIENT: 'not authenticated client',
};

class Client extends events.EventEmitter {
    constructor(){
        super();

        this.ib = new (require('../lib/ib-web-api'))({});

        this.currentState = null;
        // Register internal event handlers
        // Log and emit every state change
        Object.keys(STATE).forEach(s => {
            this.on(STATE[s], () => {
                this.currentState = STATE[s];
                this._log('info', `state change: ${STATE[s]}`);
                this.emit(EVENT.STATE_CHANGE, STATE[s])
            })
        });

        this.selectedAccount = null;

    }

    onConnected(fn) {
        this.on(STATE.CONNECTED, () => fn());
        return this;
    }

    async connect(){
        let me = this;

        this.emit(STATE.CONNECTING);
        try {
            // await me.ib.session.validate()
            //     .catch(function (err) {
            //         if(err.name === 'StatusCodeError' && err.statusCode === 401) {
            //             me._emitError(ERROR.UNAUTHORIZED_CLIENT);
            //             console.log('Not authenticated client. To authenticate the gateway session with your account, go to https://localhost:5000/ ');
            //         } else
            //             me._emitError(err.message);
            //     });
            // await me.ib.session.reauthenticate().then();

            me.ib.session.status().then(async (status) => {
                console.log(status)
                if(status.connected === true && status.authenticated === true){
                    await me.ib.account.accounts().then((data) => {
                        me.selectedAccount = data.selectedAccount;
                        // this.emit(STATE.CONNECTED);
                    });
                    me.emit(STATE.CONNECTED);
                } else {

                }
            });
        } catch (e) {

        }

    }

    async getContract(symbol, secType){
        let me = this,
            contract;
        await this.ib.contract.search(symbol, false, secType)
            .then((data) => {
                contract = data[0];
            }).catch(function (err) {
                if(err.name === 'StatusCodeError' && err.statusCode === 500)
                    me._emitError(`Contract with symbol "${symbol}" not found.`);
                else
                    me._emitError(err.message);
            });
        return contract;
    }

    async getSnapshot(contract){
        let me = this,
            snapshot;
        await this.ib.market.snapshot([contract.conid]).then((data) => {
            snapshot = data;
        });
        return snapshot;
    }

    _emitError(errMsg){
        this.emit('error', new Error(errMsg));
    }

    _log(level, ...msg) {
        console[level](...msg)
    }
}

let client = new Client()
    .on('error', function (err) {
        console.error(err.message);
    }).onConnected(async function(){
        let contract = await client.getContract('AMD', 'STK');
        // console.log(contract);
        let snapshot = await client.getSnapshot(contract);
        console.log(snapshot)
    });
client.connect();