// @flow
import * as React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import {
	type CurrencyCode,
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getCurrencyPostSymbol,
	getSatoshiDisplayValue,
	formatPriceDisplay,
} from '../../utils/badger-helpers';

import colors from '../../styles/colors';
import BitcoinCashLogoImage from '../../images/bitcoin-cash-logo.svg';
import BitcoinCashImage from '../../images/bitcoin-cash.svg';

import Button from '../../atoms/Button';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const BadgerText = styled.p`
	font-size: 20px;
	line-height: 1.2em;
	margin: 0;
`;

const SatoshiText = styled.p`
	font-size: 12px;
	margin: 0;
	display: grid;
	grid-template-columns: max-content max-content max-content;
	justify-content: end;
	grid-gap: 5px;
	align-items: center;
`;

const Small = styled.span`
	font-size: 12px;
	font-weight: 700;
`;

const Wrapper = styled.div`
	display: grid;
	grid-gap: 5px;
	font-family: sans-serif;
	grid-template-columns: max-content;
	grid-template-rows: max-content max-content max-content;
	color: ${colors.bchGrey};
`;

// Badger Badge Props
type Props = {
	to: string,
	price: number,
	currency: CurrencyCode,

	text?: string,
	showSatoshis?: boolean,
	showBrand?: boolean,
	children: React.Node,

	successFn: Function,
	failFn?: Function,
};
type State = {
	step: 'fresh' | 'pending' | 'complete',
	BCHPrice: {
		[currency: CurrencyCode]: {
			price: ?number,
			stamp: ?number,
		},
	},
};

class BadgerButton extends React.Component<Props, State> {
	static defaultProps = {
		currency: 'USD',
		showSatoshis: true,
	};

	state = {
		step: 'fresh',
		BCHPrice: {},
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
		const { to, successFn, failFn, currency, price } = this.props;
		const { BCHPrice } = this.state;

		const priceInCurrency = BCHPrice[currency].price;
		if (!priceInCurrency) {
			this.updateBCHPrice(currency);
			return;
		}

		const singleDollarValue = priceInCurrency / 100;
		const singleDollarSatoshis = 100000000 / singleDollarValue;
		const satoshis = price * singleDollarSatoshis;

		if (window && typeof window.Web4Bch !== 'undefined') {
			const { web4bch } = window;
			const web4bch2 = new window.Web4Bch(web4bch.currentProvider);

			const txParams = {
				to,
				from: web4bch2.bch.defaultAccount,
				value: satoshis,
			};

			this.setState({ step: 'pending' });

			web4bch2.bch.sendTransaction(txParams, (err, res) => {
				if (err) {
					console.log('BadgerButton send cancel', err);
					failFn && failFn(err);
					this.setState({ step: 'fresh' });
				} else {
					console.log('BadgerButton send success:', res);
					this.setState({ step: 'complete' });
					successFn(res);
				}
			});
		} else {
			window.open('https://badger.bitcoin.com');
		}
	};

	componentDidMount() {
		const { currency } = this.props;

		// Get price on load, and update price every minute
		this.updateBCHPrice(currency);
		this.priceInterval = setInterval(
			() => this.updateBCHPrice(currency),
			PRICE_UPDATE_INTERVAL
		);
	}

	componentWillUnmount() {
		this.priceInterval && clearInterval(this.priceInterval);
	}

	componentDidUpdate(prevProps: Props) {
		const { currency } = this.props;
		const prevCurrency = prevProps.currency;

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

	render() {
		const { step, BCHPrice } = this.state;
		const { text, price, currency, showSatoshis, children } = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Wrapper>
			<BadgerText style={{textAlign: 'center', }}>{text}</BadgerText>
				<Button onClick={this.handleClick} step={step}>
					<BadgerText>
						{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
						{getCurrencyPostSymbol(currency)} <Small> {currency}</Small>
					</BadgerText>
				</Button>
				{showSatoshis && (
					<SatoshiText>
						<img src={BitcoinCashImage} style={{ height: 14 }} alt="BCH" /> BCH{' '}
						<span style={{fontFamily: 'monospace'}}>{getSatoshiDisplayValue(priceInCurrency, price)}</span>
					</SatoshiText>
				)}
			</Wrapper>
		);
	}
}

export default BadgerButton;
