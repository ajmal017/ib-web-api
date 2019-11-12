# Interactive Brokers REST API JS

## API Documentation

The REST API documentation can be found in https://interactivebrokers.github.io/cpwebapi/index.html

## Installation

```sh
npm install viras34/ib-web-api --save
```

## Usage

Instantiate the API

```js
const ib = new (require('ib-web-api'))({
    baseUrl: 'https://localhost:5000/v1/portal'
});
```

Call methods, which will return a promise.

```js
ib.account.accounts().then((data) => {
    console.log('Selected Account:', data.selectedAccount);
});
```

## Methods

### Session API

#### Authentication status

Calls `GET /iserver/auth/status` and returns current Authentication status to the Brokerage system

```ts
ib.session.status() => Promise<SessionStatus>
```

#### Validate SSO

Calls `GET /sso/validate` and validates the current session for the SSO user

```ts
ib.session.validate() => Promise
```

#### Re-authenticate

Calls `GET /iserver/reauthenticate` tries to re-authenticate to Brokerage system as long as there is a valid SSO session

```ts
ib.session.reauthenticate() => Promise<SessionStatus>
```

### Contract API

#### Search by symbol or name

Calls `POST /iserver/secdef/search` and returns passed securities definitions

```ts
ib.contract.search(symbol, name, secType) => Promise<Contract[]>
```

### Orders API

#### Get Orders

Calls `GET /iserver/account/orders` and returns two objects, one is notification, the other is orders. Orders is the list of orders (cancelled, filled, submitted) with activity in the current day. Notifications contains information about execute orders as they happen, see status field.

```ts
ib.orders.orders() => Promise<{orders: Order[], notifications: Notification[}>
```

#### Place Order

Calls `/iserver/account/{accountId}/order` and returns

```ts
ib.orders.placeOrder(accountId, {
    conid: number,
    secType: string, // optional conid:type for example 265598:STK
    listingExchange: string
}, {
    cOID: string, // optional Customer Order ID. An arbitraty string that can be used to identify the order, e.g "my-fb-order"
    parentId: string, // optional When placing bracket orders, the child parentId must be equal to the cOId (customer order id) of the parent
    orderType: 'MKT' | 'LMT' | 'STP' | 'STP_LIMIT',
    outsideRTH: boolean // set to true if the order can be executed outside regular trading hours
    price: number, // optional if order is MKT, for LMT, this is the limit price. For STP this is the stop price
    quantity: number, // usually integer, for some special cases can be float numbers   
    side: 'SELL' | 'BUY',
    tif: 'GTC' | 'DAY'
    referer: string, // optional
    useAdaptive: boolean // if true, the system will use the Adaptive Algo to submit the order https://www.interactivebrokers.com/en/index.php?f=19091
}) => Promise
```
