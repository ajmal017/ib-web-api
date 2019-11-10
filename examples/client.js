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
    UNABLE_TO_CONNECT: 'unable to connect'
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

    async connect(reconnect=true){
        let me = this;

        this.emit(STATE.CONNECTING);
        try {
            //
            //
            //

            me.ib.session.status().then(async (status) => {
                console.log(status)
                if(status.connected === true && status.authenticated === true){
                    await me.ib.account.accounts().then((data) => {
                        me.selectedAccount = data.selectedAccount;
                        // this.emit(STATE.CONNECTED);
                    });
                    me.emit(STATE.CONNECTED);
                } else {
                    // await me.ib.session.validate();
                    await me.ib.session.reauthenticate().then();
                    if(reconnect)
                        await me.connect(false);
                    else
                        me._emitError(ERROR.UNABLE_TO_CONNECT);
                }
            }).catch(function (err) {
                if(err.name === 'StatusCodeError' && err.statusCode === 401) {
                    me._emitError(ERROR.UNAUTHORIZED_CLIENT);
                    console.log('Not authenticated client. To authenticate the gateway session with your account, go to https://localhost:5000/ ');
                } else
                    me._emitError(err.message);
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
        let snapshot;
        await this.ib.market.snapshot([contract.conid]).then((data) => {
            snapshot = data;
        });
        return this._normalizeSnapshot(snapshot[0]);
    }

    async submitOrder(contract, type, price, side, quantity){
        let order = {
            type: type,
            exchange: 'SMART',
            outsideRTH: true,
            price: price,
            side: side,
            tif: 'GTC',
            quantity: quantity

        };
        await this.ib.orders.placeOrder(this.selectedAccount, contract, order).then((data) => {
            order.id = data[0].order_id;
            order.status = data[0].order_status;
        }).catch(function (err) {
           console.log(err);
        });
        return order;
    }

    _normalizeSnapshot(data){
        let fields = {
            31: 'last',
            66: 'symbol',
            70: 'high',
            71: 'low',
            84: 'bid',
            85: 'bidSize',
            86: 'ask',
            88: 'askSize',
        }, out = {};
        for(let field in fields){
            if(data.hasOwnProperty(field))
                out[fields[field]] = data[field];
        }
        return out;
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
        // console.log(snapshot);
        let order = await client.submitOrder(contract, 'MKT', snapshot.ask, 'BUY', 1);

    });
client.connect();