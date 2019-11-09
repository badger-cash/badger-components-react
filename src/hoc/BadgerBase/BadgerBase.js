// @flow

import * as React from 'react';

import debounce from 'lodash/debounce';

import {
	fiatToSatoshis,
	adjustAmount,
	getAddressUnconfirmed,
	getTokenInfo,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

const SECOND = 1000;

const PRICE_UPDATE_INTERVAL = 60 * SECOND;
const INTERVAL_LOGIN = 1 * SECOND;
const REPEAT_TIMEOUT = 4 * SECOND;
const URI_CHECK_INTERVAL = 10 * SECOND;

// Whitelist of valid coinType.
type ValidCoinTypes = 'BCH' | 'SLP';

// TODO - Login/Install are badger states, others are payment states.  Separate them to be independent
type ButtonStates =
	| 'fresh'
	| 'pending'
	| 'complete'
	| 'expired'
	| 'login'
	| 'install';

type BadgerBaseProps = {
	to: string,
	stepControlled?: ButtonStates,

	// Both present to price in fiat equivalent
	currency: CurrencyCode,
	price?: number,

	// Both present to price in coinType absolute amount
	coinType: ValidCoinTypes,
	tokenId?: string,
	amount?: number,

	isRepeatable: boolean,
	repeatTimeout: number,
	watchAddress: boolean,

	opReturn?: string[],
	showQR: boolean, // Intent to show QR.  Only show if amount is BCH or fiat as OP_RETURN and SLP do not work with QR

	// Support for BIP070 Invoices
	paymentRequestUrl?: string,

	successFn?: Function,
	failFn?: Function,
};

type State = {
	step: ButtonStates,
	errors: string[],

	satoshis: ?number, // Used when converting fiat to BCH

	coinSymbol: ?string,
	coinName: ?string,
	coinDecimals: ?number,
	unconfirmedCount: ?number,
	invoiceInfo: ?Object,
	invoiceTimeLeftSeconds: ?number,

	intervalPrice: ?IntervalID,
	intervalLogin: ?IntervalID,
	intervalUnconfirmed: ?IntervalID,
	intervalTimer: ?IntervalId,
};

const BadgerBase = (Wrapped: React.AbstractComponent<any>) => {
	return class extends React.Component<BadgerBaseProps, State> {
		static defaultProps = {
			currency: 'USD',
			coinType: 'BCH',

			isRepeatable: false,
			watchAddress: false,
			showQR: true,
			repeatTimeout: REPEAT_TIMEOUT,
		};

		state = {
			step: 'fresh',

			satoshis: null,
			coinSymbol: null,
			coinDecimals: null,
			coinName: null,

			unconfirmedCount: null,
			invoiceInfo: {},
			invoiceTimeLeftSeconds: null,

			intervalPrice: null,
			intervalLogin: null,
			intervalUnconfirmed: null,
			intervalTimer: null,
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
			const {
				intervalUnconfirmed,
				unconfirmedCount,
				intervalTimer,
			} = this.state;

			this.setState({
				step: 'complete',
				unconfirmedCount: unconfirmedCount + 1,
			});

			if (isRepeatable) {
				this.startRepeatable();
			} else {
				intervalUnconfirmed && clearInterval(intervalUnconfirmed);
			}
			// If invoice is paid, clear timer, and set secondsLeft to null to hide clock
			intervalTimer && clearInterval(intervalTimer);
			this.setState({ invoiceTimeLeftSeconds: null });
		};

		invoiceExpired = () => {
			const { intervalTimer } = this.state;
			this.setState({
				step: 'expired',
			});
			intervalTimer && clearInterval(intervalTimer);
			this.setState({ invoiceTimeLeftSeconds: null });
		};

		handleClick = () => {
			const {
				amount,
				to,
				successFn,
				failFn,
				opReturn,
				coinType,
				isRepeatable,
				tokenId,
				paymentRequestUrl,
			} = this.props;

			const { satoshis } = this.state;

			// Satoshis might not set be set during server rendering
			if (!amount && !satoshis && !paymentRequestUrl) {
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

				// BCH amount = satoshis, SLP amount = absolute value
				const calculatedValue =
					coinType === 'BCH' && amount
						? adjustAmount(amount, 8)
						: amount || satoshis;

				const txParamsBase = {
					to,
					from: defaultAccount,
					value: calculatedValue,
				};

				const txParamsSLP =
					coinType === 'SLP' && tokenId
						? {
								...txParamsBase,
								sendTokenData: {
									tokenId,
									tokenProtocol: 'slp',
								},
						  }
						: txParamsBase;

				const txParamsOpReturn =
					opReturn && opReturn.length
						? { ...txParamsSLP, opReturn: { data: opReturn } }
						: txParamsSLP;

				const txParams =
					paymentRequestUrl && paymentRequestUrl.length
						? { paymentRequestUrl } // If there is an invoice, this will be the only txParams
						: txParamsOpReturn;

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

		setupWatchAddress = async () => {
			const { to } = this.props;
			const { intervalUnconfirmed } = this.state;

			intervalUnconfirmed && clearInterval(intervalUnconfirmed);

			const initialUnconfirmed = await getAddressUnconfirmed(to);
			this.setState({ unconfirmedCount: initialUnconfirmed.length });

			// Watch UTXO interval
			const intervalUnconfirmedNext = setInterval(async () => {
				const prevUnconfirmedCount = this.state.unconfirmedCount;
				const targetTransactions = await getAddressUnconfirmed(to);
				const unconfirmedCount = targetTransactions.length;

				this.setState({ unconfirmedCount });
				if (
					prevUnconfirmedCount != null &&
					unconfirmedCount > prevUnconfirmedCount
				) {
					this.paymentSendSuccess();
				}
			}, URI_CHECK_INTERVAL);

			this.setState({ intervalUnconfirmed: intervalUnconfirmedNext });
		};

		setupWatchInvoice = async () => {
			const { paymentRequestUrl } = this.props;

			this.ws = new WebSocket(
				`wss://pay.bitcoin.com/s/${paymentRequestUrl.slice(26)}`
			);

			this.ws.onmessage = (evt) => {
				// listen to data sent from the websocket server
				const invoiceInfo = JSON.parse(evt.data);

				const invoiceStatus = invoiceInfo.status; // for InvoiceDisplay

				this.setState({ invoiceInfo });
				this.setupCoinMeta(invoiceInfo);

				if (invoiceStatus === 'paid') {
					return this.paymentSendSuccess();
				}
				if (invoiceStatus === 'expired') {
					return this.invoiceExpired();
				}

				// If invoice is not expired or paid, start the timer (add this logic after timer works) TODO
				// Get current UTC time for timer
				const now = new Date();
				const nowUTC = Date.parse(now.toUTCString());

				const invoiceExpiresAt = Date.parse(invoiceInfo.expires);

				let invoiceTimeLeftSeconds = Math.round(
					(invoiceExpiresAt - nowUTC) / 1000
				);

				// Prod
				if (invoiceTimeLeftSeconds > 0) {
					this.setState({ invoiceTimeLeftSeconds });
					// start timer
					const intervalTimerNext = setInterval(() => {
						const prevInvoiceTimeLeftSeconds = this.state
							.invoiceTimeLeftSeconds;
						if (prevInvoiceTimeLeftSeconds === 1) {
							this.invoiceExpired();
						}
						const newInvoiceTimeLeftSeconds = prevInvoiceTimeLeftSeconds - 1;
						this.setState({
							invoiceTimeLeftSeconds: newInvoiceTimeLeftSeconds,
						});
					}, 1000);

					this.setState({ intervalTimer: intervalTimerNext });
				}
			};
		};

		setupCoinMeta = async (invoiceInfo = null) => {
			const { coinType, tokenId, paymentRequestUrl } = this.props;
			// If this is a BIP070 invoice for an SLP token, set values from the invoice

			if (invoiceInfo !== null && invoiceInfo.currency !== 'BCH') {
				const invoiceTokenId = invoiceInfo.outputs[0].token_id;
				const invoiceTokenInfo = await getTokenInfo(invoiceTokenId);

				const { symbol, decimals, name } = invoiceTokenInfo;

				this.setState({
					coinSymbol: symbol,
					coinDecimals: decimals,
					coinName: name,
				});
			} else if (
				(!paymentRequestUrl && coinType === 'BCH') ||
				invoiceInfo.currency === 'BCH'
			) {
				this.setState({
					coinSymbol: 'BCH',
					coinDecimals: 8,
					coinName: 'Bitcoin Cash',
				});
			} else if (!paymentRequestUrl && coinType === 'SLP' && tokenId) {
				this.setState({
					coinSymbol: null,
					coinName: null,
					coinDecimals: null,
				});
				const tokenInfo = await getTokenInfo(tokenId);

				const { symbol, decimals, name } = tokenInfo;
				this.setState({
					coinSymbol: symbol,
					coinDecimals: decimals,
					coinName: name,
				});
			}
		};

		async componentDidMount() {
			if (typeof window !== 'undefined') {
				const {
					price,
					coinType,
					amount,
					watchAddress,
					paymentRequestUrl,
				} = this.props;

				// setup state, intervals, and listeners
				watchAddress && this.setupWatchAddress();
				paymentRequestUrl && this.setupWatchInvoice();
				price && this.setupSatoshisFiat();
				!paymentRequestUrl && this.setupCoinMeta();

				// Detect Badger and determine if button should show login or install CTA
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
				const {
					currency,
					coinType,
					price,
					amount,
					isRepeatable,
					watchAddress,
					tokenId,
				} = this.props;

				const prevCurrency = prevProps.currency;
				const prevCoinType = prevProps.coinType;
				const prevPrice = prevProps.price;
				const prevAmount = prevProps.amount;
				const prevIsRepeatable = prevProps.isRepeatable;
				const prevWatchAddress = prevProps.watchAddress;
				const prevTokenId = prevProps.tokenId;

				// Fiat price or currency changes
				if (currency !== prevCurrency || price !== prevPrice) {
					this.setupSatoshisFiat();
				}

				if (isRepeatable && isRepeatable !== prevIsRepeatable) {
					this.startRepeatable();
				}

				if (tokenId !== prevTokenId && !paymentRequestUrl) {
					this.setupCoinMeta();
				}

				if (watchAddress !== prevWatchAddress) {
					if (watchAddress) {
						this.setupWatchAddress();
					} else {
						const { intervalUnconfirmed } = this.state;
						intervalUnconfirmed && clearInterval(intervalUnconfirmed);
					}
				}
			}
		}

		render() {
			const {
				amount,
				showQR,
				opReturn,
				coinType,
				stepControlled,
				paymentRequestUrl,
			} = this.props;
			const {
				step,
				satoshis,
				coinDecimals,
				coinSymbol,
				coinName,
				invoiceInfo,
				invoiceTimeLeftSeconds,
			} = this.state;

			let calculatedAmount = adjustAmount(amount, coinDecimals) || satoshis;

			// If this is a BIP70 invoice with a specified BCH amount, use that
			if (paymentRequestUrl && invoiceInfo.currency === 'BCH') {
				calculatedAmount = adjustAmount(invoiceInfo.fiatTotal, coinDecimals);
			} else if (paymentRequestUrl && invoiceInfo.currency === 'SLP') {
				// Sum up the SLP amounts from invoiceInfo.outputs[0].send_amounts
				const amounts = invoiceInfo.outputs[0].send_amounts;
				calculatedAmount = 0;
				for (let i = 0; i < amounts.length; i++) {
					calculatedAmount += amounts[i];
				}
			}

			// Only show QR if all requested features can be encoded in the BIP44 URI, or if it's a BIP70 invoice
			const shouldShowQR =
				(showQR && coinType === 'BCH' && (!opReturn || !opReturn.length)) ||
				paymentRequestUrl;

			// Show SLP icon if BIP70 invoice is for SLP
			let determinedCoinType = coinType;
			if (paymentRequestUrl && coinSymbol !== 'BCH' && coinSymbol !== null) {
				determinedCoinType = 'SLP';
			}

			return (
				<Wrapped
					{...this.props}
					coinType={determinedCoinType}
					showQR={shouldShowQR}
					handleClick={this.handleClick}
					step={stepControlled || step}
					amount={calculatedAmount}
					coinDecimals={coinDecimals}
					coinSymbol={coinSymbol}
					coinName={coinName}
					invoiceInfo={invoiceInfo}
					invoiceTimeLeftSeconds={invoiceTimeLeftSeconds}
				/>
			);
		}
	};
};

export type { BadgerBaseProps, ButtonStates, ValidCoinTypes };

export default BadgerBase;
