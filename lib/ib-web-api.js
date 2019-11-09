'use strict';

class IB {
    constructor(config = {}){
        this.configuration = {
            baseUrl: config.baseUrl || process.env.IB_API_BASE_URL || 'https://localhost:5000/v1/portal',
        };

        this.session = new (require('./resources/session'))(this.configuration.baseUrl);
        this.account = new (require('./resources/account'))(this.configuration.baseUrl);
        this.portfolio = new (require('./resources/portfolio'))(this.configuration.baseUrl);
        this.contract = new (require('./resources/contract'))(this.configuration.baseUrl);
        this.market = new (require('./resources/market'))(this.configuration.baseUrl);
        this.orders = new (require('./resources/orders'))(this.configuration.baseUrl);
    }
}

module.exports = IB;