// @flow

import * as React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	type CurrencyCode,
	getCurrencyPreSymbol,
	formatPriceDisplay,
	getCurrencyPostSymbol,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
} from '../../hoc/BadgerBase';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import colors from '../../styles/colors';

import Button from '../../atoms/Button';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const Main = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 20px;
	padding: 12px 12px 6px;
	border: 1px dashed ${colors.brand500};
	border-radius: 4px;
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
	font-size: 16px;
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
	color: ${colors.fg500};
	text-decoration: none;
	&:hover {
		color: ${colors.brand500};
	}
`;

// Badger Badger Props
type Props = BadgerBaseProps & {
	text?: string,
	tag?: string,
	showSatoshis?: boolean,
	showBrand?: boolean,

	handleClick: Function,

	step: ButtonStates,
	BCHPrice: {
		[currency: CurrencyCode]: {
			price: ?number,
			stamp: ?number,
		},
	},
};

class BadgerBadge extends React.PureComponent<Props> {
	static defaultProps = {
		currency: 'USD',
		tag: 'Badger Pay',
		showSatoshis: true,
		showBrand: true,
		text: 'Payment Total',
	};

	render() {
		const {
			text,
			price,
			currency,
			tag,
			step,
			BCHPrice,
			showSatoshis,
			showBrand,
			handleClick,
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
					<Button onClick={handleClick} step={step}>
						<Text>{tag}</Text>
					</Button>

					{showBrand && (
						<BrandBottom>
							<Small>
								<A href="badger.bitcoin.com" target="_blank">
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

export default BadgerBase(BadgerBadge);
