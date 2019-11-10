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
ib.session.status() => Promise<AuthenticationStatus>
```

#### Validate SSO

Calls `GET /sso/validate` and validates the current session for the SSO user

```ts
ib.session.validate() => Promise
```

#### Re-authenticate

Calls `GET /iserver/reauthenticate` tries to re-authenticate to Brokerage system as long as there is a valid SSO session

```ts
ib.session.reauthenticate() => Promise<AuthenticationStatus>
```

### Account API

Calls `GET /iserver/accounts` and returns list of accounts the user has trading access to, their respective aliases and the currently selected account. Note this endpoint must be called before modifying an order or querying open orders.

```ts
ib.account.accounts() => Promise
```
