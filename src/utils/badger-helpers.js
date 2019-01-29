// @flow
// Currency endpoints, logic, and formatters

import getSymbolFromCurrency from 'currency-symbol-map';

type CurrencyCode =
	| 'AED'
	| 'AFN'
	| 'ALL'
	| 'AMD'
	| 'ANG'
	| 'AOA'
	| 'ARS'
	| 'AUD'
	| 'AWG'
	| 'AZN'
	| 'BAM'
	| 'BBD'
	| 'BDT'
	| 'BGN'
	| 'BHD'
	| 'BIF'
	| 'BMD'
	| 'BND'
	| 'BOB'
	| 'BRL'
	| 'BSD'
	| 'BTN'
	| 'BWP'
	| 'BYN'
	| 'BZD'
	| 'CAD'
	| 'CDF'
	| 'CHF'
	| 'CLF'
	| 'CLP'
	| 'CNH'
	| 'CNY'
	| 'COP'
	| 'CRC'
	| 'CUC'
	| 'CUP'
	| 'CVE'
	| 'CZK'
	| 'DJF'
	| 'DKK'
	| 'DOP'
	| 'DZD'
	| 'EGP'
	| 'ERN'
	| 'ETB'
	| 'EUR'
	| 'FJD'
	| 'FKP'
	| 'GBP'
	| 'GEL'
	| 'GGP'
	| 'GHS'
	| 'GIP'
	| 'GMD'
	| 'GNF'
	| 'GTQ'
	| 'GYD'
	| 'HKD'
	| 'HNL'
	| 'HRK'
	| 'HTG'
	| 'HUF'
	| 'IDR'
	| 'ILS'
	| 'IMP'
	| 'INR'
	| 'IQD'
	| 'IRR'
	| 'ISK'
	| 'JEP'
	| 'JMD'
	| 'JOD'
	| 'JPY'
	| 'KES'
	| 'KGS'
	| 'KHR'
	| 'KMF'
	| 'KPW'
	| 'KRW'
	| 'KWD'
	| 'KYD'
	| 'KZT'
	| 'LAK'
	| 'LBP'
	| 'LKR'
	| 'LRD'
	| 'LSL'
	| 'LYD'
	| 'MAD'
	| 'MDL'
	| 'MGA'
	| 'MKD'
	| 'MMK'
	| 'MNT'
	| 'MOP'
	| 'MRO'
	| 'MUR'
	| 'MVR'
	| 'MWK'
	| 'MXN'
	| 'MYR'
	| 'MZN'
	| 'NAD'
	| 'NGN'
	| 'NIO'
	| 'NOK'
	| 'NPR'
	| 'NZD'
	| 'OMR'
	| 'PAB'
	| 'PEN'
	| 'PGK'
	| 'PHP'
	| 'PKR'
	| 'PLN'
	| 'PYG'
	| 'QAR'
	| 'RON'
	| 'RSD'
	| 'RUB'
	| 'RWF'
	| 'SAR'
	| 'SBD'
	| 'SCR'
	| 'SDG'
	| 'SEK'
	| 'SGD'
	| 'SHP'
	| 'SLL'
	| 'SOS'
	| 'SRD'
	| 'SSP'
	| 'STD'
	| 'SVC'
	| 'SYP'
	| 'SZL'
	| 'THB'
	| 'TJS'
	| 'TMT'
	| 'TND'
	| 'TOP'
	| 'TRY'
	| 'TTD'
	| 'TWD'
	| 'TZS'
	| 'UAH'
	| 'UGX'
	| 'USD'
	| 'UYU'
	| 'UZS'
	| 'VEF'
	| 'VND'
	| 'VUV'
	| 'WST'
	| 'XAF'
	| 'XAG'
	| 'XAU'
	| 'XCD'
	| 'XDR'
	| 'XOF'
	| 'XPD'
	| 'XPF'
	| 'XPT'
	| 'YER'
	| 'ZAR'
	| 'ZMW'
	| 'ZWL';


const buildPriceEndpoint = (currency: CurrencyCode) => {
	return `https://index-api.bitcoin.com/api/v0/cash/price/${currency}`;
};

const getCurrencyPreSymbol = (currency: CurrencyCode) => {
	return getSymbolFromCurrency(currency);

	// 	switch (currency) {
	// 		case 'USD':
	// 		case 'CAD':
	// 			return '$';
	// 		case 'GBP':
	// 			return '£';
	// 		case 'EUR':
	// 			return '€';
	// 		case 'HKD':
	// 			return 'HK$';
	// 		case 'JPY':
	// 			return '¥';
	// 		default:
	// 			return '';
	// 	}
	// };
};

const getCurrencyPostSymbol = (currency: CurrencyCode) => {
	return '';

	// switch (currency) {
	// 	case 'CNY':
	// 		return '元';
	// 	default:
	// 		return '';
	// }
};

const formatPriceDisplay = (price?: number) => {
	if (!price) return null;

	if (price >= 1) {
		if (price % 1 === 0) {
			// Over 1 no decimal, use whole number
			return price.toFixed(0);
		}
		// Over 1 decimal, show 2 decimals
		return price.toFixed(2);
	}
	// Under 1 show first 2 largest occupied decimals
	return price.toPrecision(2);
};

const getSatoshiDisplayValue = (priceInCurrency?: number, price: number) => {
	if (!priceInCurrency) {
		return '-.--------';
	}
	const singleDollarValue = priceInCurrency / 100;
	const singleDollarSatoshis = 100000000 / singleDollarValue;
	return (Math.trunc(price * singleDollarSatoshis) / 100000000).toFixed(8);
};

const priceToSatoshis = (BCHRate: number, price: number) => {
	const singleDollarValue = BCHRate / 100;
	const singleDollarSatoshis = 100000000 / singleDollarValue;
	return price * singleDollarSatoshis;
};


const currencyOptions: CurrencyCode[] = [
	'AED',
	'AFN',
	'ALL',
	'AMD',
	'ANG',
	'AOA',
	'ARS',
	'AUD',
	'AWG',
	'AZN',
	'BAM',
	'BBD',
	'BDT',
	'BGN',
	'BHD',
	'BIF',
	'BMD',
	'BND',
	'BOB',
	'BRL',
	'BSD',
	'BTN',
	'BWP',
	'BYN',
	'BZD',
	'CAD',
	'CDF',
	'CHF',
	'CLF',
	'CLP',
	'CNH',
	'CNY',
	'COP',
	'CRC',
	'CUC',
	'CUP',
	'CVE',
	'CZK',
	'DJF',
	'DKK',
	'DOP',
	'DZD',
	'EGP',
	'ERN',
	'ETB',
	'EUR',
	'FJD',
	'FKP',
	'GBP',
	'GEL',
	'GGP',
	'GHS',
	'GIP',
	'GMD',
	'GNF',
	'GTQ',
	'GYD',
	'HKD',
	'HNL',
	'HRK',
	'HTG',
	'HUF',
	'IDR',
	'ILS',
	'IMP',
	'INR',
	'IQD',
	'IRR',
	'ISK',
	'JEP',
	'JMD',
	'JOD',
	'JPY',
	'KES',
	'KGS',
	'KHR',
	'KMF',
	'KPW',
	'KRW',
	'KWD',
	'KYD',
	'KZT',
	'LAK',
	'LBP',
	'LKR',
	'LRD',
	'LSL',
	'LYD',
	'MAD',
	'MDL',
	'MGA',
	'MKD',
	'MMK',
	'MNT',
	'MOP',
	'MRO',
	'MUR',
	'MVR',
	'MWK',
	'MXN',
	'MYR',
	'MZN',
	'NAD',
	'NGN',
	'NIO',
	'NOK',
	'NPR',
	'NZD',
	'OMR',
	'PAB',
	'PEN',
	'PGK',
	'PHP',
	'PKR',
	'PLN',
	'PYG',
	'QAR',
	'RON',
	'RSD',
	'RUB',
	'RWF',
	'SAR',
	'SBD',
	'SCR',
	'SDG',
	'SEK',
	'SGD',
	'SHP',
	'SLL',
	'SOS',
	'SRD',
	'SSP',
	'STD',
	'SVC',
	'SYP',
	'SZL',
	'THB',
	'TJS',
	'TMT',
	'TND',
	'TOP',
	'TRY',
	'TTD',
	'TWD',
	'TZS',
	'UAH',
	'UGX',
	'USD',
	'UYU',
	'UZS',
	'VEF',
	'VND',
	'VUV',
	'WST',
	'XAF',
	'XAG',
	'XAU',
	'XCD',
	'XDR',
	'XOF',
	'XPD',
	'XPF',
	'XPT',
	'YER',
	'ZAR',
	'ZMW',
	'ZWL',
];


export type { CurrencyCode };

export {
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getCurrencyPostSymbol,
	getSatoshiDisplayValue,
	formatPriceDisplay,
	priceToSatoshis,
	currencyOptions
};
