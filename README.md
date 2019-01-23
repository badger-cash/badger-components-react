<h1 align="center">
  Build on Bitcoin Cash (BCH)
</h1>

 > A set of React components and helpers to integrate Bitcoin Cash (BCH) and the Badger wallet into your app with ease.

## Get Started

### Install

 ```bash
$ npm install --save badger-components-react
```


### Add to React project code

```js
import React from 'react'
import { BadgerButton, BadgerBadge} from 'badger-components-react'

const Example = (props) => {
  const toAddress = 'Put in some address here' // TODO: Determine which address should be the default send address, and where the funds go.
  return (
    <>
      <BadgerBadge to={toAddress}
    </>
  )
};

export default Example
```

### Create a custom Badger Button

```js
import React from 'react'
import { BadgerBase } from 'badger-react-components'

const MyButton extends React.Component {
  render() {
    // Props from higher order component
    const {handleClick, to, price, currency, BCHPrice, step} = this.props;
    return (
      <button onClick={handleClick}>Custom looking button and render</button>
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