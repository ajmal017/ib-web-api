'use strict';

class Portfolio extends (require('./resource')) {

    /**
     * In non-tiered account structures, returns a list of accounts for which the user can view position and account information.
     * This endpoint must be called prior to calling other /portfolio endpoints for those accounts.
     * For querying a list of accounts which the user can trade, see /iserver/accounts.
     * For a list of subaccounts in tiered account structures (e.g. financial advisor or ibroker accounts) see /portfolio/subaccounts.
     * @returns {*}
     */
    accounts() {
        return this.httpRequest('/portfolio/accounts');
    }

    /**
     * Account information related to account Id /portfolio/accounts or /portfolio/subaccounts must be called prior to this endpoint.
     * @param accountId
     * @returns {*}
     */
    meta(accountId) {
        return this.httpRequest('/portfolio/:accountId/meta', {
            accountId: accountId
        });
    }

    /**
     * Returns information about margin, cash balances and other information related to specified account.
     * See also /portfolio/{accountId}/ledger. /portfolio/accounts or /portfolio/subaccounts must be called prior to this endpoint.
     * @param accountId
     * @returns {*}
     */
    summary(accountId) {
        return this.httpRequest('/portfolio/:accountId/summary', {
            accountId: accountId
        });
    }

    /**
     * Information regarding settled cash, cash balances, etc. in the account's base currency and any other cash balances hold in other currencies.
     * /portfolio/accounts or /portfolio/subaccounts must be called prior to this endpoint.
     * The list of supported currencies is available at https://www.interactivebrokers.com/en/index.php?f=3185
     * @param accountId
     * @returns {*}
     */
    ledger(accountId) {
        return this.httpRequest('/portfolio/:accountId/ledger', {
            accountId: accountId
        });
    }

}

module.exports = Portfolio;