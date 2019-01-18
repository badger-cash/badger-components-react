# BadgerBadge

This component renders a basic BadgerBadge.  
A Payment Badge for us with the Badger wallet

## Example Usage

```jsx
import React from 'react';
import { BadgerBadge } from '@bitcoincom/badger-buttons';

class MyClass extends React.Component {
	successFn() {
		console.log('Ack! You got me!');
	}
	failFn(err) {
		console.err('Transaction failed or cancelled');
	}
	render() {
		// const { paymentAddress, amount, currency} = this.props

		const paymentAddress = 'qInsettCashAddrHere'; // CashAddr funds sent to
		const amount = 0.1; // Amount of target currency to convert for payment
		const currency = 'CAD'; // Target currency to convert to relative BCH amount

		return (
			<section>
				<BadgerBadge
					to={paymentAddress}
					amount={amount}
					currency={currency}
					successFn={this.successFn}
          failFn={this.failFn}
          tag="Send Now"
          text="Complete Payment"
				/>
			</section>
		);
	}
}
```
