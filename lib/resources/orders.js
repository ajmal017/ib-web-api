'use strict';

/**
 * Possible order statuses
 * ------------------------
 * PendingSubmit - indicates that you have transmitted the order, but have not yet received confirmation that it has been accepted by the order destination.
 * PendingCancel - indicates that you have sent a request to cancel the order but have not yet received cancel confirmation from the order destination. At this point, your order is not confirmed canceled. It is not guaranteed that the cancellation will be successful.
 * PreSubmitted - indicates that a simulated order type has been accepted by the IB system and that this order has yet to be elected. The order is held in the IB system until the election criteria are met. At that time the order is transmitted to the order destination as specified .
 * Submitted - indicates that your order has been accepted by the system.
 * ApiCancelled - after an order has been submitted and before it has been acknowledged, an API client client can request its cancelation, producing this state.
 * Cancelled - indicates that the balance of your order has been confirmed canceled by the IB system. This could occur unexpectedly when IB or the destination has rejected your order.
 * Filled - indicates that the order has been completely filled. Market orders executions will not always trigger a Filled status.
 * Inactive - indicates that the order was received by the system but is no longer active because it was rejected or canceled.
 */
class Orders extends (require('./resource')) {
    /**
     * The end-point is meant to be used in polling mode, e.g. requesting every x seconds.
     * The response will contain two objects, one is notification, the other is orders.
     * Orders is the list of orders (cancelled, filled, submitted) with activity in the current day.
     * Notifications contains information about execute orders as they happen, see status field.
     * @returns {Promise}
     */
    orders() {
        return this.httpRequest('/iserver/account/orders');
    }

    /**
     * Please note here, sometimes this end-point alone can't make sure you submit the order successfully,
     * you could receive some questions in the response,
     * you have to to answer them in order to submit the order successfully.
     * You can use "/iserver/reply/{replyid}" end-point to answer questions
     *
     * @param {String} accountId
     * @param contract
     * @param order
     * @returns {Promise}
     */
    placeOrder(accountId, contract, order) {
        return this.httpRequest(`/iserver/account/${accountId}/order`, {}, {
            acctId: accountId,
            conid: contract.conid,
            secType: contract.secType | undefined,
            cOID: order.cOID | undefined,
            parentId: order.parentId | undefined,
            orderType: order.type,
            listingExchange: contract.listingExchange | undefined,
            outsideRTH: order.outsideRTH | false,
            price: Number(order.price),
            side: order.side,
            // // ticker: string,
            tif: order.tif,
            referrer: order.referrer | undefined,
            quantity: order.quantity,
            useAdaptive: order.useAdaptive | false
        }, 'POST');
    }

    /**
     * You can pass a list of orders here (Support bracket orders)
     *
     * @param {String} accountId
     * @param {Array} orders
     * @returns {Promise}
     */
    placeOrders(accountId, orders) {
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
    delete(accountId, origCustomerOrderId) {
        return this.httpRequest(`/iserver/account/${accountId}/order/${origCustomerOrderId}`, {}, {}, 'DELETE');
    }
}

module.exports = Orders;