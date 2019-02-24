# Build on Bitcoin Cash (BCH)

 > A set of React components and helpers to integrate Bitcoin Cash (BCH) and SLP tokens into your app with ease.  Integrates with the Badger wallet.

## Get Started

* [Homepage](https://badger.bitcoin.com)
* [Component Showcase](http://badger-storybook.surge.sh)
* [Developer Documentation](https://developer.bitcoin.com/badger)
* [NPM page](https://www.npmjs.com/package/badger-components-react)

### Install Component

 ```bash
$ npm install --save badger-components-react
```

### Install Peer Dependencies

This library depends on the following three peer dependencies

* `styled-components` ^4.0.0
* `react` ^16.3.0
* `react-dom` ^16.3.0

```bash
$ npm install --save styled-components react react-dom
```

### Add to React Project

```js
import React from 'react'
import { BadgerButton, BadgerBadge } from 'badger-components-react'

const Example = (props) => {

  // eatBCH bitcoin cash address
  const toAddress = 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'

  // Random SLP address
  const toSLPAddress = 'simpleledger:qq6qcjt6xlkeqzdwkhdvfyl2q2d2wafkgg8phzcqez'

  // tokenId
  const nakamotoID = 'df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb'

  return (
    <>
      {/* Minimal Examples */}
      <BadgerBadge to={toAddress} price={0.5} currency='USD' />
      <BadgerButton to={toAddress} price={1} currency='JPY' />

      {/* Price in bch */}
      <BadgerBadge to={toAddress} amount={0.01} coinType='BCH' />
      <BadgerButton to={toAddress} amount={0.0001} coinType='BCH' />

      {/* Price in SLP tokens - NAKAMOTO in this example */}
      <BadgerBadge to={toSLPAddress} amount={5.01} coinType='SLP' tokenId={nakamotoID} />
      <BadgerButton to={toSLPAddress} amount={2.0001} coinType='SLP' tokenId={nakamotoID} />

      {/* More Complex Examples, pricing in fiat */}
      <BadgerBadge
        price={0.001} // Price in currency
        currency='CAD' // Currency to convert from
        to='bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' // Payment address
        opReturn={["0x6d02", "Hello badger-components-react"]}
        tag='Badger Pay' // Text on button
        text='Payment Total' // Text at top of badge

        showBrand// Show link to badger website
        showAmount // Show BCH satoshi amount
        showQR // Intent to show QR if transaction is URI encodeable

        successFn={() => console.log('Payment success callback')}
        failFn={() => console.warn('Payment failed or cancelled callback')}
      />

      <BadgerButton
        price={0.003}
        currency='USD'
        to='bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
        opReturn={["0x6d02", "Hello badger-components-react"]}
        text='Badger Pay'
        showAmount
        showBorder
        showQR
        successFn={() => console.log('success example function called')}
        failFn={() => console.log('fail example function called')}
      />

      {/* Pricing in BCH */}
      <BadgerBadge
        amount={0.001} // Amount in crypto
        coinType='BCH' // Defaults to BCH
        to='bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' // Payment address

        isRepeatable // Reset to fresh state after a few seconds
        repeatTimeout={4000} // time in ms to reset button after payment
        watchAddress // Watch all payments to address
      />
    </>
  )
};

export default Example
```

### Create a Custom Badger Button / Integration

```js
import React from 'react'
import { BadgerBase, formatAmount } from 'badger-react-components'

import styled from 'styled-components'

const CoolButton = styled.button`
  background-color: rebeccapurple;
  color: lime;
  border-radius: 24px;
`

const MyButton extends React.Component {
  render() {
    // Props from higher order component
    const {
      handleClick,
      to,
      step,

      price,
      currency,

      coinType,
      coinDecimals,
      coinSymbol,
      amount,

      showQR,

      isRepeatable,
      repeatTimeout,
      watchAddress,
      } = this.props;

    return (
      <div>
        <h3>Donate {price}{currency} to {to}</h3>
        <h4>Satoshis: {formatAmount(amount, coinDecimals)}</h4>
        <CoolButton onClick={handleClick}>Custom looking button with render</CoolButton>
      </div>
    )
  }
}

// Wrap with BadgerBase higher order component
export default BadgerBase(MyButton);
```

### Control Step from app

When accepting payments, the state of the payment should be handled by the backend of your application.  As such, you can pass in `stepControlled` with the values of `fresh`, `pending` or `complete` to indicate which part of the payment the user is on.

## Development with Storybook

To develop additions to this project, run the local storybook development server with

### Setup

 ```bash
  $ npm install -g flow-bin
  $ npm i
  $ npm run storybook
```

 Navigate to [http://localhost:9001](http://localhost:9001) to view your stories. They automatically update as you develop ✨.

 Storybook will pick up stories from the `stories.js` file in each components folder.

 To build a static version of storybook for deployment

 ```bash
  $ npm run build-storybook
  Deploy contents of  `/storybook-static`
 ```