'use strict';

class Account extends (require('./resource')) {

    /**
     * Returns a list of accounts the user has trading access to, their respective aliases and the currently selected account.
     * Note this endpoint must be called before modifying an order or querying open orders.
     * @returns {Promise}
     */
    accounts() {
        return this.httpRequest('/iserver/accounts');
    }

    /**
     * Returns an object containing PnLfor the selected account and its models (if any).
     * @returns {*}
     */
    pnl() {
        return this.httpRequest('/iserver/account/pnl/partitioned');
    }
}

module.exports = Account;