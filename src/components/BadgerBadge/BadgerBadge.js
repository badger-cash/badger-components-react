// @flow

import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon, faCheck } from '@fortawesome/react-fontawesome';

import {
	type CurrencyCode,
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getCurrencyPostSymbol,
	formatPriceDisplay,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import colors from '../../styles/colors';

import Button from '../../atoms/Button';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const Main = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 24px;
	padding: 12px 12px 6px;
	border: 1px dashed
		${(props) => (props.color3 ? props.color3 : colors.bchGrey)};
	border-radius: 4px;
	background-color: ${(props) => (props.color2 ? props.color2 : 'inherit')};
	color: ${(props) => (props.color3 ? props.color3 : 'inherit')};
`;

const ButtonText = styled.p`
	font-size: 20px;
	line-height: 1em;
	margin: 0;
`;

const Prices = styled.div`
	display: grid;
	grid-template-columns: max-content max-content;
	grid-gap: 5px;
	align-items: end;
	justify-content: end;
`;
const PriceText = styled.p`
	font-family: monospace;
	font-size: 18px;
	line-height: 1em;
	margin: 0;
`;

const HeaderText = styled.h3`
	text-align: center;
	font-size: 28px;
	line-height: 1em;
	margin: 0;
	font-weight: 400;
`;

const Small = styled.span`
	font-size: 12px;
	font-weight: 700;
`;

const ButtonContainer = styled.div`
	min-height: 40px;
	display: grid;
	grid-gap: 7px;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
`;

const BrandBottom = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const A = styled.a`
	color: ${colors.bchGrey};
	text-decoration: none;
	&:hover {
		color: ${colors.brand500};
	}
`;

// Badger Badge Props
type Props = {
	to: string,
	price: number,
	currency: CurrencyCode,

	text?: string,
	tag?: string,
	showSatoshis?: boolean,
	showBrand?: boolean,
	

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
		tag: 'Badger Pay',
		showBrand: true,
		text: 'Payment Total'
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
			const {defaultAccount} = web4bch2.bch;

			if(!defaultAccount){
				this.setState({step: 'login'});
				return;
			}

			const txParams = {
				to,
				from: defaultAccount,
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
					successFn(res);
					this.setState({ step: 'complete' });
				}
			});
		} else {
			this.setState({state: 'install'});
			// window.open('https://badger.bitcoin.com');
		}
	};

	componentDidMount() {
		const currency = this.props.currency;

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
		const {
			text,
			price,
			currency,
			showSatoshis,
			tag,
			showBrand,
		} = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Main>
				<HeaderText>{text}</HeaderText>
				<Prices>
					<PriceText style={{ textAlign: 'right' }}>
						{getCurrencyPreSymbol(currency)}
						{formatPriceDisplay(price)} {getCurrencyPostSymbol(currency)}{' '}
					</PriceText>
					<Small>{currency}</Small>
					{showSatoshis && (
						<>
							<PriceText>
								<img src={BitcoinCashImage} style={{ height: 14 }} alt="BCH" />{' '}
								{getSatoshiDisplayValue(priceInCurrency, price)}
							</PriceText>
							<Small>BCH</Small>
						</>
					)}
				</Prices>
				<ButtonContainer>
					<Button
						onClick={this.handleClick}
						step={step}
					>
						<ButtonText>{tag}</ButtonText>
					</Button>

					{showBrand && (
						<BrandBottom>
							<Small>
								<A
									href="badger.bitcoin.com"
									target="_blank"
								>
									What is Badger
								</A>
							</Small>
						</BrandBottom>
					)}
				</ButtonContainer>
			</Main>
		);
	}
}

export default BadgerButton;
