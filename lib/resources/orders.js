'use strict';

class Orders extends (require('./resource')){
    /**
     * The end-point is meant to be used in polling mode, e.g. requesting every x seconds.
     * The response will contain two objects, one is notification, the other is orders.
     * Orders is the list of orders (cancelled, filled, submitted) with activity in the current day.
     * Notifications contains information about execute orders as they happen, see status field.
     * @returns {Promise}
     */
    getAll()
    {
        return this.httpRequest('/iserver/account/orders');
    }

    /**
     * Please note here, sometimes this end-point alone can't make sure you submit the order successfully,
     * you could receive some questions in the response,
     * you have to to answer them in order to submit the order successfully.
     * You can use "/iserver/reply/{replyid}" end-point to answer questions
     *
     * @param accountId
     * @param contract
     * @param order
     * @returns {Promise}
     */
    placeOrder(accountId, contract, order)
    {
        return this.httpRequest(`/iserver/account/${accountId}/order`, {}, {
            acctId: accountId,
            conid: contract.conid,
            // // secType: string,
            // // cOID: string,
            // // parentId: string,
            orderType: order.type,
            // listingExchange: order.exchange,
            // outsideRTH: true,
            price: Number(order.price),
            side: order.side,
            // // ticker: string,
            tif: order.tif,
            // // referrer: string,
            quantity: order.quantity,
            // useAdaptive: true
        }, 'POST');
    }

    /**
     * You can pass a list of orders here (Support bracket orders)
     *
     * @param {String} accountId
     * @param {Array} orders
     * @returns {Promise}
     */
    placeOrders(accountId, orders)
    {
        return this.httpRequest('/iserver/account/{accountId}/orders', {
            accountId: accountId
        }, {
            orders: orders,
        }, 'POST');
    }

    /**
     *
     * @param accountId
     * @param origCustomerOrderId
     * @returns {Promise}
     */
    delete(accountId, origCustomerOrderId)
    {
        return this.httpRequest('/iserver/account/accountId:/order/:origCustomerOrderId', {
            accountId: accountId,
            origCustomerOrderId: origCustomerOrderId
        }, {}, 'DELETE');
    }
}

module.exports = Orders;