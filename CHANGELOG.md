# Changelog - Badger Components React

## 0.1.0 (EST February 2019)

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
* Change text above
* Toggle showing the satoshi amopunt
  
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

## 0.0.x (January 28, 2019)

* Initial beta releases.  Features changing quickly, not recommended yet for use.