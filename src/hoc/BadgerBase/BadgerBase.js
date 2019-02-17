// @flow

import * as React from 'react';

import debounce from 'lodash/debounce';

import { fiatToSatoshis } from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

const PRICE_UPDATE_INTERVAL = 60 * 1000;
const INTERVAL_LOGIN = 1000;
const REPEAT_TIMEOUT = 3 * 1000;

type ValidTickers = 'BCH';

type BadgerBaseProps = {
	to: string,

	// Both present to price in fiat equivalent
	currency: CurrencyCode,
	price?: number,

	// Both present to price in ticker absolute amount
	ticker: ValidTickers,
	amount?: number,

	isRepeatable: boolean,

	opReturn?: string[],

	successFn?: Function,
	failFn?: Function,
};

type ButtonStates = 'fresh' | 'pending' | 'complete' | 'login' | 'install';

// White list of valid tickers

type State = {
	step: ButtonStates,
	errors: string[],

	satoshis: ?number,

	intervalPrice: ?IntervalID,
	intervalLogin: ?IntervalID,
};

const BadgerBase = (Wrapped: React.AbstractComponent<any>) => {
	return class extends React.Component<BadgerBaseProps, State> {
		static defaultProps = {
			currency: 'USD',
			ticker: 'BCH',

			isRepeatable: false,
		};

		state = {
			step: 'fresh',

			satoshis: null,
			ticker: null,

			intervalPrice: null,
			intervalLogin: null,
			errors: [],
		};

		addError = (error: string) => {
			const { errors } = this.state;
			this.setState({ errors: [...errors, error] });
		};

		handleClick = () => {
			const { to, successFn, failFn, opReturn, isRepeatable } = this.props;
			const { satoshis } = this.state;

			// Satoshis might not set be set during server rendering
			if (!satoshis) {
				return;
			}

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
					value: satoshis,
				};

				const txParams = opReturn
					? { ...txParamsBase, opReturn: { data: opReturn } }
					: { ...txParamsBase };

				this.setState({ step: 'pending' });

				// console.info('Badger send begin', txParams);
				web4bch2.bch.sendTransaction(txParams, (err, res) => {
					if (err) {
						console.info('Badger send cancel', err);
						failFn && failFn(err);
						this.setState({ step: 'fresh' });
					} else {
						console.info('Badger send success:', res);
						successFn && successFn(res);
						this.setState({ step: 'complete' });
						if (isRepeatable) {
							setTimeout(
								() => this.setState({ step: 'fresh' }),
								REPEAT_TIMEOUT
							);
						}
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
				}, INTERVAL_LOGIN);

				this.setState({ intervalLogin });
			}
		};

		updateSatoshisFiat = debounce(
			async () => {
				const { price, currency } = this.props;

				if (!price) return;
				const satoshis = await fiatToSatoshis(currency, price);
				this.setState({ satoshis });
			},
			250,
			{ lead: true, trailing: true }
		);

		async componentDidMount() {
			if (typeof window !== 'undefined') {
				const { currency, price, ticker, amount } = this.props;

				if (price) {
					await this.updateSatoshisFiat();
					const intervalPrice = setInterval(
						async () => await this.updateSatoshisFiat(),
						PRICE_UPDATE_INTERVAL
					);
					this.setState({ intervalPrice });
				} else if (amount) {
					if (ticker === 'BCH') {
						this.setState({ satoshis: amount });
					} else {
						this.addError(
							`Ticker ${ticker} not supported by this version of badger-react-components`
						);
					}
				}

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
			if (typeof window !== 'undefined') {
				const { currency, ticker, price, amount } = this.props;
				const { intervalPrice } = this.state;

				const prevCurrency = prevProps.currency;
				const prevTicker = prevProps.ticker;
				const prevPrice = prevProps.price;
				const prevAmount = prevProps.amount;

				if (currency !== prevCurrency || price !== prevPrice) {
					intervalPrice && clearInterval(intervalPrice);

					const intervalPriceNext = setInterval(
						() => this.updateSatoshisFiat(),
						PRICE_UPDATE_INTERVAL
					);

					this.setState({ intervalPrice: intervalPriceNext });
					this.updateSatoshisFiat();
				}

				// TODO - handle update if amount or ticker changes.
			}
		}

		render() {
			const { step, satoshis } = this.state;

			return (
				<Wrapped
					{...this.props}
					handleClick={this.handleClick}
					step={step}
					satoshis={satoshis}
				/>
			);
		}
	};
};

export type { BadgerBaseProps, ButtonStates };

export default BadgerBase;
