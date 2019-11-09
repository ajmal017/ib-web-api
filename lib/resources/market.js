'use strict';

class Market extends (require('./resource')) {

    /**
     * Get Market Data for the given conid(s).
     * The end-point will return by default bid, ask, last, change, change pct, close, listing exchange.
     * See response fields for a list of available fields that can be request via fields argument.
     * The endpoint /iserver/accounts should be called prior to /iserver/marketdata/snapshot.
     * To receive all available fields the /snapshot endpoint will need to be called several times.
     * @param {Array} ids
     * @param {Number} since Time period since which updates are required. uses epoch time with milliseconds
     * @param {Array} fields
     */
    snapshot(ids, since = undefined, fields = undefined) {
        return this.httpRequest('/iserver/marketdata/snapshot', {
            conids: ids.join(),
            since: since,
            fields: fields ? fields.join() : undefined
        });
    }

    /**
     * Get history of market Data for the given id, length of data is controlled by period and bar. e.g. 1y period with bar =1w returns 52 data points
     * @param id
     * @param period
     * @param bar
     */
    history(id, period, bar) {
        return this.httpRequest('/iserver/marketdata/history', {
            conid: id,
            since: period,
            bar: bar ? bar : undefined
        });
    }


}

module.exports = Market;