// @flow

import * as React from 'react';
import styled from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
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
	showBorder?: boolean,
	showQR?: boolean,

	satoshiDisplay: string,
	handleClick: Function,
	step: ButtonStates,
};

class BadgerButton extends React.PureComponent<Props> {
	static defaultProps = {
		currency: 'USD',
		showSatoshis: true,
		showBorder: false,

		showQR: true,
	};

	render() {
		const {
			text,
			price,
			currency,
			step,
			handleClick,
			showSatoshis,
			satoshiDisplay,
			showBorder,
			showQR
		} = this.props;

		return (
			<Outter>
				<Wrapper hasBorder={showBorder}>
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
								{satoshiDisplay}
							</span>
						</SatoshiText>
					)}
				</Wrapper>
			</Outter>
		);
	}
}

export default BadgerBase(BadgerButton);
