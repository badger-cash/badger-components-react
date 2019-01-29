# BadgerButton

Renders a basic BadgerButton to integrate with the Badger wallet.  
This is a very basic button, ideal for a minimal payment/donation, or if your application wants to control the majority of the payment layout.

## Example Usage

```jsx
import React from 'react';
import { BadgerButton } from 'badger-components-react';

class MyClass extends React.PureComponent {
	render() {

		const paymentAddress = 'qInsertCashAddrHere'; // CashAddr funds sent to
		const amount = 0.1; // Amount of target currency to convert for payment
		const currency = 'CAD'; // Target currency to convert to relative BCH amount

		return (
			<section>
				<BadgerButton
					to={paymentAddress}
					amount={amount}
					currency={currency}
					successFn={(tx) => console.log(tx)}
					failFn={(err) => console.log(err)}
					text="Donate with BCH"
				/>
			</section>
		);
	}
}
```
