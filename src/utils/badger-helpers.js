// @flow

// Currency endpoints, logic, and formatters
type CurrencyCode = 'USD' | 'CAD' | 'HKD' | 'JPY' | 'GBP' | 'EUR' | 'CNY'


const buildPriceEndpoint = (currency:CurrencyCode) => {
	return `https://index-api.bitcoin.com/api/v0/cash/price/${currency}`;
};

const getCurrencyPreSymbol = (currency:CurrencyCode) => {
	switch (currency) {
		case 'USD':
		case 'CAD':
			return '$';
		case 'GBP':
			return '£';
		case 'EUR':
			return '€';
		case 'HKD':
			return 'HK$';
		case 'JPY':
			return '¥';
		default:
			return '';
	}
};

const getCurrencyPostSymbol = (currency:CurrencyCode) => {
	switch (currency) {
		case 'CNY':
			return '元';
		default:
			return '';
	}
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

export type  { CurrencyCode }

export {
	buildPriceEndpoint,
	getCurrencyPreSymbol,
  getCurrencyPostSymbol,
  getSatoshiDisplayValue,
	formatPriceDisplay,
};
