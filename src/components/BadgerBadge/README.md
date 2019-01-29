# BadgerBadge

This component renders a basic BadgerBadge.  
A Payment Badge for us with the Badger wallet. 

## Example Usage

```jsx
import React from 'react';
import { BadgerBadge } from 'badger-components-react';

class MyClass extends React.Component {
	successFn() {
		console.log('Ack! You got me!');
	}
	failFn(err) {
		console.err('Transaction failed or cancelled');
	}
	render() {

	// EatBCH address for example purposes.
		const paymentAddress = 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
		const amount = 0.1; // Amount of target currency to convert for payment
		const currency = 'CAD'; // Target currency to convert to relative BCH amount
		const opReturn = 'OP_RETURN 621 54657374206d6573736167652e'

		return (
			<section>
				<BadgerBadge
					to={paymentAddress}
					amount={amount}
					currency={currency}
					successFn={this.successFn}
					failFn={this.failFn}
					opReturn={opReturn}
          tag="Send Now"
          text="Complete Payment"
				/>
			</section>
		);
	}
}
```
