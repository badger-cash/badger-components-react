# Build on Bitcoin Cash (BCH)

 > A set of React components and helpers to integrate Bitcoin Cash (BCH) and the Badger wallet into your app with ease.

## Get Started

* [Homepage](https://badger.bitcoin.com)
* [Component Showcase](http://badger-storybook.surge.sh)

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
import { BadgerButton, BadgerBadge} from 'badger-components-react'

const Example = (props) => {

  // EatBCH address for example purposes.
  const toAddress = 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'

  return (
    <>
      {/* Minimal Examples */}
      <BadgerBadge to={toAddress} price={0.5} currency='USD' />
      <BadgerButton to={toAddress} price={1} currency='JPY' />

      <BadgerBadge to={toAddress} amount={0.01} ticker='BCH' />
      <BadgerButton to={toAddress} amount={0.0001} currency='BCH' />

      {/* More Complex Examples, pricing in fiat */}
      <BadgerBadge
        price={0.001} // Price in currency
        currency='CAD' // Currency to convert from
        to='bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g' // Payment address
        opReturn={["0x6d02", "Hello badger-components-react"]}
        tag='Badger Pay' // Text on button
        text='Payment Total' // Text at top of badge
        showBrand// Show link to badger website
        showSatoshis // Show BCH satoshi amount
        showQR
        successFn={() => console.log('Payment success callback')}
        failFn={() => console.warn('Payment failed or cancelled callback')}
      />

      <BadgerButton
        price={0.003}
        currency='USD'
        to='bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
        opReturn={["0x6d02", "Hello badger-components-react"]}
        text='Badger Pay'
        showSatoshis
        showBorder
        showQR
        successFn={() => console.log('success example function called')}
        failFn={() => console.log('fail example function called')}
      />

      {/* Pricing in BCH */}
      <BadgerBadge
        amount={0.001} // Amount in crypto
        ticker='BCH' // Defaults to BCH
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
import { BadgerBase, formatSatoshis } from 'badger-react-components'

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
      price,
      currency,
      ticker,
      amount,
      satoshis,
      step,
      isRepeatable,
      repeatTimeout,
      watchAddress } = this.props;

    return (
      <div>
        <h3>Donate {price}{currency} to {to}</h3>
        <h4>Satoshis: {formatSatoshis(satoshis)}</h4>
        <CoolButton onClick={handleClick}>Custom looking button with render</CoolButton>
      </div>
    )
  }
}

// Wrap with BadgerBase higher order component
export default BadgerBase(MyButton);
```

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