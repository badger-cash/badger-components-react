# Badger Base (HOC)

The base life-cycle and state methods for Badger functionality and integration.  
Badger buttons and badges get wrapped in this Higher Order Component (HOC), which provides it with the key functions and state to deal with Badger Payments.


## What it does

* Fetch and update prices
* handleClick functionality
* Handle OP_RETURN
* Mounting setup
* Unmounting cleanup


### Fiat Pricing
if props `currency` and `price` are entered, the real world fiat currency to BCH price will be computed and automatically set

### Token Pricing
if props `ticker` and `amount` are entered that amount of the chosen `ticker` token/coin will be used as payment.
For now works with only `BCH`, but will extend to use SLP tokens.