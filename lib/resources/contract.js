'use strict';

class Contract
{
    constructor(client)
    {
        this.client = client;
    }

    /**
     *
     * @param {String} symbol symbol or name to be searched
     * @param name should be true if the search is to be performed by name. false by default.
     * @param {String} secType If search is done by name, only the assets provided in this field will be returned. Currently, only STK is supported.
     * @returns {*}
     */
    search(symbol, name, secType)
    {
        return this.client.httpRequest('/iserver/secdef/search', {}, {
            symbol: symbol,
            name: name || false,
            secType: secType
        }, 'POST');
    }

    /**
     * List of security definitions for the given conids
     * @param {Array} conids
     * @returns {*}
     */
    secdef(conids)
    {
        return this.client.httpRequest('/trsrv/secdef', {}, {
            conids: conids,
        }, 'POST');
    }

    /**
     *
     * @param {Array} symbols
     * @returns {*}
     */
    futures(symbols)
    {
        return this.client.httpRequest('/trsrv/futures', {
            symbols: symbols.join(),
        });
    }
}

module.exports = Contract;