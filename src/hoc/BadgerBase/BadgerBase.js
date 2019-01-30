// @flow

import * as React from 'react';

import {
	buildPriceEndpoint,
	priceToSatoshis,
} from '../../utils/badger-helpers';

import {
	type CurrencyCode
} from '../../utils/currency-helpers';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

type BadgerBaseProps = {
	to: string,
	price: number,
	currency: CurrencyCode,

	opReturn?: string,

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
};

const BadgerBase = (Wrapped: React.AbstractComponent<any>) => {
	return class extends React.Component<BadgerBaseProps, State> {
		static defaultProps = {
			currency: 'USD',
		};

		state = {
			step: 'fresh',
			BCHPrice: {},
		};

		constructor(props) {
			super(props);
			this.priceInterval = null;
			this.intervalLogin = null;
		}

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

				const txParams = {
					to,
					from: defaultAccount,
					value: satoshis,
					opreturn: opReturn,
				};

				this.setState({ step: 'pending' });

				console.log(txParams);
				web4bch2.bch.sendTransaction(txParams, (err, res) => {
					if (err) {
						console.log('BadgerButton send cancel', err);
						failFn && failFn(err);
						this.setState({ step: 'fresh' });
					} else {
						console.log('BadgerButton send success:', res);
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
			this.setState({ step: 'login' });
			if (typeof window !== 'undefined') {
				this.intervalLogin = setInterval(() => {
					const { web4bch } = window;
					const web4bch2 = new window.Web4Bch(web4bch.currentProvider);
					const { defaultAccount } = web4bch2.bch;
					if (defaultAccount) {
						clearInterval(this.intervalLogin);
						this.setState({ step: 'fresh' });
					}
				}, 1000);
			}
		};

		componentDidMount() {
			// Get price on load, and update price every minute
			if (typeof window !== 'undefined') {
				const currency = this.props.currency;
				this.updateBCHPrice(currency);
				this.priceInterval = setInterval(
					() => this.updateBCHPrice(currency),
					PRICE_UPDATE_INTERVAL
				);

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
			this.priceInterval && clearInterval(this.priceInterval);
			this.intervalLogin && clearInterval(this.intervalLogin);
		}

		componentDidUpdate(prevProps: Props) {
			const { currency } = this.props;
			const prevCurrency = prevProps.currency;
			if (typeof window !== 'undefined') {
				// Clear previous price interval, set a new one, and immediately update price
				if (currency !== prevCurrency) {
					this.priceInterval && clearInterval(this.priceInterval);

					this.priceInterval = setInterval(
						() => this.updateBCHPrice(currency),
						PRICE_UPDATE_INTERVAL
					);
					this.updateBCHPrice(currency);
				}
			}
		}

		render() {
			const { ...passThrough } = this.props;
			const { step, BCHPrice } = this.state;

			return (
				<Wrapped
					{...passThrough}
					handleClick={this.handleClick}
					step={step}
					BCHPrice={BCHPrice}
				/>
			);
		}
	};
};

export type { BadgerBaseProps, ButtonStates };

export default BadgerBase;
