// @flow

import * as React from 'react';
import styled from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

import {
	type CurrencyCode
} from '../../utils/currency-helpers';

import colors from '../../styles/colors';
import BitcoinCashImage from '../../images/bitcoin-cash.svg';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
} from '../../hoc/BadgerBase';

import Button from '../../atoms/Button';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';

const SatoshiText = styled.p`
	font-size: 12px;
	margin: 0;
	display: grid;
	grid-template-columns: max-content max-content max-content;
	justify-content: end;
	grid-gap: 5px;
	align-items: center;
`;

const Outter = styled.div`
	display: grid;
	grid-template-columns: max-content;
`;
const Wrapper = styled.div`
	display: grid;
	grid-gap: 5px;
	font-family: sans-serif;
	grid-template-columns: max-content;
	grid-template-rows: max-content max-content max-content;
	color: ${colors.fg500};
	padding: 6px;
	border: ${(props) =>
		props.hasBorder ? `1px dashed ${colors.brand700}` : 'none'};
	border-radius: 4px;
`;

// Badger Button Props
type Props = BadgerBaseProps & {
	text?: string,
	showSatoshis?: boolean,
	border?: boolean,

	handleClick: Function,

	step: ButtonStates,
	BCHPrice: {
		[currency: CurrencyCode]: {
			price: ?number,
			stamp: ?number,
		},
	},
};

class BadgerButton extends React.PureComponent<Props> {
	static defaultProps = {
		currency: 'USD',
		showSatoshis: true,
		border: true,
	};

	render() {
		const {
			text,
			price,
			currency,
			showSatoshis,
			step,
			BCHPrice,
			handleClick,
			border,
		} = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Outter>
				<Wrapper hasBorder={border}>
					<Text style={{ textAlign: 'center' }}>{text}</Text>
					<Button onClick={handleClick} step={step}>
						<Text>
							{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
							<Small> {currency}</Small>
						</Text>
					</Button>
					{showSatoshis && (
						<SatoshiText>
							<img
								src={BitcoinCashImage}
								style={{ height: 14, margin: 0 }}
								alt="BCH"
							/>{' '}
							BCH{' '}
							<span style={{ fontFamily: 'monospace' }}>
								{getSatoshiDisplayValue(priceInCurrency, price)}
							</span>
						</SatoshiText>
					)}
				</Wrapper>
			</Outter>
		);
	}
}

export default BadgerBase(BadgerButton);
