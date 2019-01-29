<h1 align="center">
  Build on Bitcoin Cash (BCH)
</h1>

 > A set of React components and helpers to integrate Bitcoin Cash (BCH) and the Badger wallet into your app with ease.

## Get Started

### Install Components

 ```bash
$ npm install --save badger-components-react
```

### Install Peer Dependencies

* `styled-components` ^4.0.0
  * `npm install --save styled-components`
* `react` && `react-dom` ^16.0.0
  * `npm install --save react react-dom

### Add to React project

```js
import React from 'react'
import { BadgerButton, BadgerBadge} from 'badger-components-react'

const Example = (props) => {

  // EatBCH address for example purposes.
  const toAddress = 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'

  return (
    <>
      <BadgerBadge to={toAddress} price={0.5} currency={'USD'} />
      <BadgerButton to={toAddress} price={1} currency={'JPY'} />
    </>
  )
};

export default Example
```

### Create a custom Badger Button

```js
import React from 'react'
import { BadgerBase } from 'badger-react-components'

import styled from 'styled-components'

const CoolButton = styled.button`
  background-color: rebeccapurple;
  color: lime;
  border-radius: 24px;
`

const MyButton extends React.Component {
  render() {
    // Props from higher order component
    const {handleClick, to, price, currency, BCHPrice, step} = this.props;
    return (
      <div>
        <h3>Donate {price}{currency} to {to}</h3>
        <CoolButton onClick={handleClick}>Custom looking button with render</CoolButton>
      </div>
    )
  }
}

// Wrap with BadgerBase higher order component
export default BadgerBase(MyButton);
```

## Development w/ Storybook

To develop additions to this project, run the local storybook development server with

#### Setup
* Install `flow-bin`
  * `npm install -g flow-bin`

 ```bash
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