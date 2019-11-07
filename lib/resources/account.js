'use strict';

class Account
{
    constructor(client)
    {
        this.client = client;
    }

    /**
     * In non-tiered account structures, returns a list of accounts for which the user can view position and account information.
     * This endpoint must be called prior to calling other /portfolio endpoints for those accounts.
     * For querying a list of accounts which the user can trade, see /iserver/accounts.
     * For a list of subaccounts in tiered account structures (e.g. financial advisor or ibroker accounts) see /portfolio/subaccounts.
     * @returns {*}
     */
    accounts()
    {
        return this.client.httpRequest('/portfolio/accounts');
    }

    /**
     * Account information related to account Id /portfolio/accounts or /portfolio/subaccounts must be called prior to this endpoint.
     * @param accountId
     * @returns {*}
     */
    meta(accountId)
    {
        return this.client.httpRequest('/portfolio/:accountId/meta', {
            accountId: accountId
        });
    }

    /**
     * Returns information about margin, cash balances and other information related to specified account.
     * See also /portfolio/{accountId}/ledger. /portfolio/accounts or /portfolio/subaccounts must be called prior to this endpoint.
     * @param accountId
     * @returns {*}
     */
    summary(accountId)
    {
        return this.client.httpRequest('/portfolio/:accountId/summary', {
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
    ledger(accountId)
    {
        return this.client.httpRequest('/portfolio/:accountId/ledger', {
            accountId: accountId
        });
    }

    /**
     * Returns an object containing PnLfor the selected account and its models (if any).
     * @returns {*}
     */
    pnl()
    {
        return this.client.httpRequest('/iserver/account/pnl/partitioned');
    }
}

module.exports = Account;