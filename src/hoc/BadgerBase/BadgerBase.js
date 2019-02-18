// @flow

import * as React from 'react';

import debounce from 'lodash/debounce';

import {
	fiatToSatoshis,
	bchToSatoshis,
	getAddressUnconfirmed,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

const SECOND = 1000;

const PRICE_UPDATE_INTERVAL = 60 * SECOND;
const INTERVAL_LOGIN = 1 * SECOND;
const REPEAT_TIMEOUT = 4 * SECOND;
const URI_CHECK_INTERVAL = 10 * SECOND;

// Whitelist of valid tickers.
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
	repeatTimeout: number,
	watchAddress: boolean,

	opReturn?: string[],

	successFn?: Function,
	failFn?: Function,
};

// TODO - Login/Install are badger states, others are payment states.  Separate them to be indepdendant.
type ButtonStates = 'fresh' | 'pending' | 'complete' | 'login' | 'install';

type State = {
	step: ButtonStates,
	errors: string[],

	satoshis: ?number,
	unconfirmedCount?: number,

	intervalPrice: ?IntervalID,
	intervalLogin: ?IntervalID,
	intervalUnconfirmed: ?IntervalID,
};

const BadgerBase = (Wrapped: React.AbstractComponent<any>) => {
	return class extends React.Component<BadgerBaseProps, State> {
		static defaultProps = {
			currency: 'USD',
			ticker: 'BCH',

			isRepeatable: false,
			watchAddress: false,
			repeatTimeout: REPEAT_TIMEOUT,
		};

		state = {
			step: 'fresh',

			satoshis: null,
			ticker: null,

			intervalPrice: null,
			intervalLogin: null,
			intervalUnconfirmed: null,
			errors: [],
		};

		addError = (error: string) => {
			const { errors } = this.state;
			this.setState({ errors: [...errors, error] });
		};

		startRepeatable = () => {
			const { repeatTimeout } = this.props;
			setTimeout(() => this.setState({ step: 'fresh' }), repeatTimeout);
		};

		paymentSendSuccess = () => {
			const { isRepeatable } = this.props;
			const { intervalUnconfirmed, unconfirmedCount } = this.state;

			this.setState({
				step: 'complete',
				unconfirmedCount: unconfirmedCount + 1,
			});
			if (isRepeatable) {
				this.startRepeatable();
			} else {
				clearInterval(intervalUnconfirmed);
			}
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

				console.info('Badger send begin', txParams);
				web4bch2.bch.sendTransaction(txParams, (err, res) => {
					if (err) {
						console.info('Badger send cancel', err);
						failFn && failFn(err);
						this.setState({ step: 'fresh' });
					} else {
						console.info('Badger send success:', res);
						successFn && successFn(res);
						this.paymentSendSuccess();
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

		setupSatoshisFiat = () => {
			const { intervalPrice } = this.state;
			intervalPrice && clearInterval(intervalPrice);

			this.updateSatoshisFiat();
			const intervalPriceNext = setInterval(
				() => this.updateSatoshisFiat(),
				PRICE_UPDATE_INTERVAL
			);

			this.setState({ intervalPrice: intervalPriceNext });
		};

		async componentDidMount() {
			if (typeof window !== 'undefined') {
				const {
					currency,
					price,
					ticker,
					amount,
					to,
					watchAddress,
					isRepeatable,
				} = this.props;

				// Watch for any source of payment to the address, not only Badger
				if (watchAddress) {
					const initialUnconfirmed = await getAddressUnconfirmed(to);
					this.setState({ unconfirmedCount: initialUnconfirmed.length });

					// Watch UTXO interval
					const intervalUnconfirmed = setInterval(async () => {
						const prevUnconfirmedCount = this.state.unconfirmedCount;
						const targetTransactions = await getAddressUnconfirmed(to);
						const unconfirmedCount = targetTransactions.length;

						this.setState({ unconfirmedCount });
						if (unconfirmedCount > prevUnconfirmedCount) {
							this.paymentSendSuccess();
						}
					}, URI_CHECK_INTERVAL);

					this.setState({ intervalUnconfirmed });
				}

				if (price) {
					await this.updateSatoshisFiat();
					this.setupSatoshisFiat();
				} else if (amount) {
					if (ticker === 'BCH') {
						this.setState({ satoshis: bchToSatoshis(amount) });
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
			const { intervalPrice, intervalLogin, intervalUnconfirmed } = this.state;
			intervalPrice && clearInterval(intervalPrice);
			intervalLogin && clearInterval(intervalLogin);
			intervalUnconfirmed && clearInterval(intervalUnconfirmed);
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
					this.setupSatoshisFiat();
				}
				if (ticker !== prevTicker || amount !== prevAmount) {
					// Currently BCH only ticker supported
					if (ticker === 'BCH') {
						this.setState({ satoshis: bchToSatoshis(amount) });
					}
				}
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
