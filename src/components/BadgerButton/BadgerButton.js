// @flow
import * as React from 'react';
import styled from 'styled-components';

import {
	type CurrencyCode,
	getCurrencyPreSymbol,
	formatPriceDisplay,
	getCurrencyPostSymbol,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

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
	border: 1px dashed ${colors.brand700};
	border-radius: 4px;
`;

// Badger Button Props
type Props = BadgerBaseProps & {
	text?: string,
	showSatoshis?: boolean,

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
		} = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Outter>
				<Wrapper>
					<Text style={{ textAlign: 'center' }}>{text}</Text>
					<Button onClick={handleClick} step={step}>
						<Text>
							{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
							{getCurrencyPostSymbol(currency)} <Small> {currency}</Small>
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
