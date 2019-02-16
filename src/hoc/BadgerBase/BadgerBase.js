// @flow

import * as React from 'react';

import {
	buildPriceEndpoint,
	priceToSatoshis,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

import {
	type CurrencyCode
} from '../../utils/currency-helpers';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

type BadgerBaseProps = {
	to: string,
	price: number,
	currency: CurrencyCode,
	

	opReturn?: string[],

	successFn?: Function,
	failFn?: Function,
};

type ButtonStates = 'fresh' | 'pending' | 'complete' | 'login' | 'install';

type State = {
	step: ButtonStates,
	BCHPrice: {
		[currency: CurrencyCode]: {
			price: ?number,
			stamp: ?number,
		},
	},

	intervalPrice: ?IntervalID,
	intervalLogin: ?IntervalID,
};

const BadgerBase = (Wrapped: React.AbstractComponent<any>) => {
	return class extends React.Component<BadgerBaseProps, State> {
		static defaultProps = {
			currency: 'USD',
		};

		state = {
			step: 'fresh',
			BCHPrice: {},

			intervalPrice: null,
			intervalLogin: null,
		};

		updateBCHPrice = async (currency: CurrencyCode) => {
			const priceRequest = await fetch(buildPriceEndpoint(currency));
			const result = await priceRequest.json();

			const { price, stamp } = result;
			this.setState({
				BCHPrice: { [currency]: { price, stamp } },
			});
		};

		handleClick = () => {
			const { to, successFn, failFn, currency, price, opReturn } = this.props;
			const { BCHPrice } = this.state;

			const currencyPriceBCH = BCHPrice[currency].price;
			if (!currencyPriceBCH) {
				this.updateBCHPrice(currency);
				return;
			}

			const satoshis = priceToSatoshis(currencyPriceBCH, price);

			if (
				typeof window !== `undefined` &&
				typeof window.Web4Bch !== 'undefined'
			) {
				const { web4bch } = window;

				const web4bch2 = new window.Web4Bch(web4bch.currentProvider);
				const { defaultAccount } = web4bch2.bch;

				if (!defaultAccount) {
					this.setState({ step: 'login' });
					return;
				}

				const txParamsBase = {
					to,
					from: defaultAccount,
					value: satoshis
				};

				const txParams = opReturn 
					? {...txParamsBase, opReturn: {data: opReturn}}
					: {...txParamsBase}

				this.setState({ step: 'pending' });

				console.info('Badger send begin', txParams);
				web4bch2.bch.sendTransaction(txParams, (err, res) => {
					if (err) {
						console.info('Badger send cancel', err);
						failFn && failFn(err);
						this.setState({ step: 'fresh' });
					} else {
						console.info('Badger send success:', res);
						successFn && successFn(res);
						this.setState({ step: 'complete' });
					}
				});
			} else {
				this.setState({ step: 'install' });

				if (typeof window !== 'undefined') {
					window.open('https://badger.bitcoin.com');
				}
			}
		};

		gotoLoginState = () => {
			// Setup login state, and check if the user is logged in every second
			this.setState({ step: 'login' });
			if (typeof window !== 'undefined') {
				const intervalLogin = setInterval(() => {
					const { web4bch } = window;
					const web4bch2 = new window.Web4Bch(web4bch.currentProvider);
					const { defaultAccount } = web4bch2.bch;
					if (defaultAccount) {
						clearInterval(intervalLogin);
						this.setState({ step: 'fresh' });
					}
				}, 1000);

				this.setState({intervalLogin});
			}
		};

		componentDidMount() {
			// Get price on load, and update price every minute
			if (typeof window !== 'undefined') {
				const currency = this.props.currency;
				this.updateBCHPrice(currency);
				const intervalPrice = setInterval(
					() => this.updateBCHPrice(currency),
					PRICE_UPDATE_INTERVAL
				);

				this.setState({intervalPrice});

				// Determine if button should show login or install CTA
				if (window.Web4Bch) {
					const { web4bch } = window;
					const web4bch2 = new window.Web4Bch(web4bch.currentProvider);
					const { defaultAccount } = web4bch2.bch;
					if (!defaultAccount) {
						this.gotoLoginState();
					}
				} else {
					this.setState({ step: 'install' });
				}
			}
		}

		componentWillUnmount() {
			const { intervalPrice, intervalLogin } = this.state;
			intervalPrice && clearInterval(intervalPrice);
			intervalLogin && clearInterval(intervalLogin);
		}

		componentDidUpdate(prevProps: BadgerBaseProps) {
			const { currency } = this.props;
			const { intervalPrice } = this.state;
			const prevCurrency = prevProps.currency;
			if (typeof window !== 'undefined') {
				// Clear previous price interval, set a new one, and immediately update price
				if (currency !== prevCurrency) {
					intervalPrice && clearInterval(intervalPrice);

					const intervalPriceNext = setInterval(
						() => this.updateBCHPrice(currency),
						PRICE_UPDATE_INTERVAL
					);

					this.setState({intervalPrice: intervalPriceNext})
					this.updateBCHPrice(currency);
				}
			}
		}

		render() {
			const { currency, price, ...passThrough  } = this.props;
			const { step, BCHPrice } = this.state;

			const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;
			const satoshiDisplay = getSatoshiDisplayValue(priceInCurrency, price)

			return (
				<Wrapped
					{...passThrough}
					currency={currency}
					price={price}

					handleClick={this.handleClick}
					step={step}
					BCHPrice={BCHPrice}
					satoshiDisplay={satoshiDisplay}
				/>
			);
		}
	};
};

export type { BadgerBaseProps, ButtonStates };

export default BadgerBase;
