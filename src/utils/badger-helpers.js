// @flow
// Currency endpoints, logic, converters and formatters

import BigNumber from 'bignumber.js'
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

const getTokenInfo = async (coinId: string): Promise<any> => {
	const tokenInfoRequest = await fetch(
		`https://rest.bitcoin.com/v2/slp/list/${coinId}`
	);
	const tokenInfo = await tokenInfoRequest.json();
	return tokenInfo;
};

const getCurrencyPreSymbol = (currency: CurrencyCode) => {
	return currencySymbolMap[currency];
};

const formatPriceDisplay = (price: ?number): ?string => {
	if (!price) return null;
	return +price.toFixed(5);
};

const formatAmount = (amount: ?number, decimals: ?number): string => {
	if (decimals == null) {
		return '-.--------';
	}
	if (!amount) {
		return `-.`.padEnd(decimals + 2, '-');
	}
	const adjustDecimals = (amount / Math.pow(10, decimals)).toFixed(decimals);
	const removeTrailing = +adjustDecimals + '';

	return removeTrailing;
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

const adjustAmount = (amount: ?number, decimals: number): ?number => {
	return amount ? new BigNumber(amount).multipliedBy(Math.pow(10, decimals)).toString() : null;
};

export {
	adjustAmount,
	buildPriceEndpoint,
	fiatToSatoshis,
	formatAmount,
	formatPriceDisplay,
	getAddressUnconfirmed,
	getCurrencyPreSymbol,
	getTokenInfo,
	priceToSatoshis,
};
