# Changelog - Badger Components React

## 0.11.0 (April 9, 2020)

* Adds support for new prop, `logoQR`, can be set to "SLP" or "BCH" for a new QR code style in BadgerBadge or BadgerButton

## 0.10.0 (March 10, 2020)

* Updating price conversion API endpoint to be consistent with other bitcoin.com prices

## 0.9.0 (February 20, 2020)

* Adds support for wallet api package for multi wallet support (https://developer.bitcoin.com/wallet-api/)

## 0.8.0 (January 17, 2020)

* Success function calls when invoice paid from non-badger wallet
  
## 0.7.0 (Nov 7, 2019)

* Added invoice timer for BIP 70 invoices
* Added status animations for BIP 70 invoices (paid, expired), checked via websocket (support for pay.bitcoin.com BIP70 invoices only)
* If `paymentRequestUrl` is passed to `BadgerButton` or `BadgerBadge`, countdown timer will display automatically

## 0.6.0 (September 19, 2019)

* Added support for BIP 70 invoices
* new prop
  * `paymentRequestUrl` - The URL of a generated BIP70 invoice, e.g. `https://pay.bitcoin.com/i/85WzjgbFrDL5F6LX5DHqkf`
* New prop passed to wrapped components
  * `BadgerButton` and `BadgerBadge` can accept `paymentRequestUrl`
  * If `paymentRequestUrl` is set, `showQR` will render QR code for the invoice, and `showAmount` will show that the button references an invoice
  * There is not an obvious default fail mode for malformed or expired `paymentRequestUrl` entries; this should be handled with the `failFn` prop depending on the developer's use case

## 0.5.0 (July 25, 2019)

* Updating lots of development packages
* Upgrading storybook to latest version
* Math fix when calculating numbers
  
## 0.4.0 (Jun 17, 2019)

* Updating to use new green colors

## 0.3.1 (June 10, 2019)

* Fixing rendering issue in Safari

## 0.3.0 (February xx, 2019)

SLP support added  🎉

### BadgerBase (HOC)

* Added SLP support to BadgerBase and all components which use this HOC
* Amounts of coins/tokens show as many decimals as needed rather than the most possible
* new props
  * `tokenId` - ID of SLP token when `coinType` is set to `SLP`
  * `stepControlled` - Step of payment passed into component. Useful for when the payment is tracked and validated from a backend.
* changed props
  * `ticker` => `coinType`
    * Renamed as many coins/tokens can share a ticker.  `coinType` denotes the coin or token protocol.   `BCH`, `SLP` supported currently, with others potentially in the future.
  * `showQR` - Will only show a QR code if the transaction and options can be encoded in BIP44 URI's
* New props passed to wrapped components
  * `coinDecimals` - Number of decimals the coin or token support.  8 for BCH, variable for SLP
  * `coinSymbol` - Symbol assigned to the coin or token
  * `coinName` - Name assigned to the coin or token

### PriceDisplay

New component PriceDisplay `contains` all the logic to display amounts in fiat, BCH, and SLP tokens.  
Used in both BadgerButton and BadgerBadge to display the price information.  Useful for custom Badger integrations, letting the developers focus on building the app, not formatting prices.  

## 0.2.1 (February 19, 2019)

* Fixing URI/QR Code Satoshi calculation

## 0.2.0 (February 18, 2019)

Major changes to internal workings of the library.  Can now control amounts independently from Satoshis, should be the base work required to easily add SLP tokens in the near future.

### BadgerBase

* Enabling crypto pricing.  Can enter an absolute amount of BCH, not just fiat conversions
  * use props `ticker` and `amount` to price in BCH.
    * example: `<BadgerButton ticker='BCH' amount={0.00000550} to=...`
* New props
  * `watchAddress` - Confirm if payment comes from any source or anyone
  * `isRepeatable` - Rest the button to `fresh` state after a brief period
  * `repeatTimeout` - Number of milliseconds to reset button to `fresh` after a repeatable payment
  * `ticker` - Crypto to price in, currently only supports BCH
  * `amount` - Amount of given ticker for payment

### BadgerButton

* Rename prop `border` => `showBorder`
* Enable BCH only payments

### BadgerBadge

* Adding QR Code and Payment URI
  * prop `showQR` default `true`
  * Uses `ButtonQR` instead of `Button`
* watch payments to address as well as QR
* Handles BCH only payments
* New props
  * `showBorder`
  * `showQR`

### ButtonQR

* Allow people to pay who don't have Badger installed.  Now Badger handles  all the payment methods with ease.
* New component to show a QR code as a URI link, along with button

## 0.1.5 (February 14, 2019)

### Badger Base / Button / Badge

* OP_RETURN support added

## 0.1.4 (February 11, 2019)

### Button

* Enforce minimum width on Button so there's always enough room for the various State text.

## 0.1.3 (February 4, 2019)

### Build

* library targets `commonjs` again, static rendering should be working.
* Removing  one external dependency
* peerDepencies `react` and `react-dom` set to ^16.3.0

## 0.1.1 (February 2, 2019)

### Build

* Changing library target to UMD
* Including basic babel runtime in library build

## 0.1.0 (January 30, 2019)

### BadgerBase

* BadgerBase Higher Order Component (HOC) to deal with the core Badger interactions
* Use this HOC to build and style your own Badger intergrations
* Automatically convert a price + currency into satoshi amount, updating every minute
* Multi-currency support
  * All currencies from here https://index.bitcoin.com/
  * AED AFN ALL AMD ANG AOA ARS AUD AWG AZN BAM BBD BDT BGN BHD BIF BMD BND BOB BRL BSD BTN BWP BYN BZD CAD CDF CHF CLF CLP CNH CNY COP CRC CUC CUP CVE CZK DJF DKK DOP DZD EGP ERN ETB EUR FJD FKP GBP GEL GGP GHS GIP GMD GNF GTQ GYD HKD HNL HRK HTG HUF IDR ILS IMP INR IQD IRR ISK JEP JMD JOD JPY KES KGS KHR KMF KPW KRW KWD KYD KZT LAK LBP LKR LRD LSL LYD MAD MDL MGA MKD MMK MNT MOP MRO MUR MVR MWK MXN MYR MZN NAD NGN NIO NOK NPR NZD OMR PAB PEN PGK PHP PKR PLN PYG QAR RON RSD RUB RWF SAR SBD SCR SDG SEK SGD SHP SLL SOS SRD SSP STD SVC SYP SZL THB TJS TMT TND TOP TRY TTD TWD TZS UAH UGX USD UYU UZS VEF VND VUV WST XAF XAG XAU XCD XDR XOF XPD XPF XPT YER ZAR ZMW ZWL 
* Base handles all logic to build a badger button
  
### BadgerButton

* Simple button to drop into your React application
* Change text above button
* Toggle showing the satoshi amount
* Toggle Border around button
  
### BadgerBadge

* Payment component with room for additional text and more verbose currency /payment messaging.
* The recommended Badger component to use currently
* Change all text
* Optionally show Satoshi amount
* Optional show link back to badger.bitcoin.com

### Button - Internal

* Core button component used in our badger buttons
* Prompts users to download or login to badger if required.
* Indicates the process of the badger payment as it goes along, fresh, pending, complete

## 0.0.x (January xx, 2019)

* Initial beta releases and early development work.  Features changing quickly, not recommended for use
