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

const getTokenInfo = async (coinId: string): Promise<any> => {
	const tokenInfoRequest = await fetch(
		`https://rest.bitcoin.com/v2/slp/list/${coinId}`
	)
	const tokenInfo = await tokenInfoRequest.json()
	console.log('token')
	console.log(tokenInfo);
	return tokenInfo;
}

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

const formatAmount = (amount: ?number, decimals: ?number) : string => {
	if(decimals == null) {
		return '-.--------';
	}
	if(!amount) {
		return `-.`.padEnd(decimals + 2, '-');
	}
	return (amount / Math.pow(10, decimals)).toFixed(decimals);
}

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

// const priceToBCH = (BCHRate: number, price:number):number => {
// 	const satoshis = priceToSatoshis(BCHRate, price);

// 	const singleDollarSatoshis = 100000000 / singleDollarValue;
// 	const satoshis = 
// }

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

const adjustAmount = (amount: ?number, decimals: ?number): ?number => {
	return amount ? amount * Math.pow(10, decimals) : null;
};

// const 

export {
	adjustAmount,
	buildPriceEndpoint,
	fiatToSatoshis,
	formatAmount,
	formatPriceDisplay,
	formatSatoshis,
	getAddressUnconfirmed,
	getCurrencyPreSymbol,
	getSatoshiDisplayValue,
	getTokenInfo,
	priceToSatoshis,
};
