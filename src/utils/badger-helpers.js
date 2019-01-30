// @flow
// Currency endpoints, logic, and formatters

import getSymbolFromCurrency from 'currency-symbol-map';

import { type CurrencyCode } from './currency-helpers';

const buildPriceEndpoint = (currency: CurrencyCode) => {
	return `https://index-api.bitcoin.com/api/v0/cash/price/${currency}`;
};

const getCurrencyPreSymbol = (currency: CurrencyCode) => {
	return getSymbolFromCurrency(currency);
};

const formatPriceDisplay = (price?: number) => {
	if (!price) return null;
	return +price.toFixed(5);
};

const getSatoshiDisplayValue = (priceInCurrency: ?number, price: number) => {
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

export {
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getSatoshiDisplayValue,
	formatPriceDisplay,
	priceToSatoshis,
};
