// @flow
// Currency endpoints, logic, converters and formatters

import { currencySymbolMap, type CurrencyCode } from './currency-helpers';

const buildPriceEndpoint = (currency: CurrencyCode) => {
	return `https://index-api.bitcoin.com/api/v0/cash/price/${currency}`;
};

const getAddressUnconfirmed = async (address: string): Promise<string[]> => {
	const transactionsRequest = await fetch(
		`https://rest.bitcoin.com/v2/address/unconfirmed/${address}`
	);
	const result = await transactionsRequest.json();
	return result.utxos || [];
};

const getCurrencyPreSymbol = (currency: CurrencyCode) => {
	return currencySymbolMap[currency];
};

const formatPriceDisplay = (price?: number): ?number => {
	if (!price) return null;
	return +price.toFixed(5);
};

const formatSatoshis = (satoshis: ?number): string => {
	if (!satoshis) {
		return '-.--------';
	}
	return (satoshis / 100000000).toFixed(8);
};

const getSatoshiDisplayValue = (
	priceInCurrency: ?number,
	price: number
): string => {
	if (!priceInCurrency) {
		return '-.--------';
	}
	const singleDollarValue = priceInCurrency / 100;
	const singleDollarSatoshis = 100000000 / singleDollarValue;
	return (Math.trunc(price * singleDollarSatoshis) / 100000000).toFixed(8);
};

const priceToSatoshis = (BCHRate: number, price: number): number => {
	const singleDollarValue = BCHRate / 100;
	const singleDollarSatoshis = 100000000 / singleDollarValue;
	return Math.floor(price * singleDollarSatoshis);
};

const fiatToSatoshis = async (
	currency: CurrencyCode,
	price: number
): Promise<number> => {
	const priceRequest = await fetch(buildPriceEndpoint(currency));
	const result = await priceRequest.json();
	const fiatPrice = result.price;
	const satoshis = priceToSatoshis(fiatPrice, price);
	return satoshis;
};

const bchToSatoshis = (bchAmount: number): number => {
	return bchAmount * 1e8;
};

export {
	bchToSatoshis,
	buildPriceEndpoint,
	fiatToSatoshis,
	formatPriceDisplay,
	formatSatoshis,
	getAddressUnconfirmed,
	getCurrencyPreSymbol,
	getSatoshiDisplayValue,
	priceToSatoshis,
};
