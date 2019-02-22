// @flow

import * as React from 'react';
import styled from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	formatSatoshis,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

import colors from '../../styles/colors';
import BitcoinCashImage from '../../images/bitcoin-cash.svg';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
	type ValidCoinTypes,
} from '../../hoc/BadgerBase';

import Button from '../../atoms/Button';
import ButtonQR from '../../atoms/ButtonQR';
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

const Outer = styled.div`
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

	showAmount?: boolean,
	showBorder?: boolean,
	showQR?: boolean,

	showAmount?: boolean,
	coinSymbol: string,
	coinDecimals?: number,

	handleClick: Function,
	step: ButtonStates,
};

class BadgerButton extends React.PureComponent<Props> {
	static defaultProps = {
		showSatoshis: true,
		showBorder: false,
		showQR: false,
	};

	render() {
		const {
			to,
			step,
			handleClick,

			currency,
			price,
			
			coinType,
			coinSymbol,
			coinDecimals,
			amount,
			showAmount,

			text,
			showBorder,
			showQR,
		} = this.props;

		return (
			<Outer>
				<Wrapper hasBorder={showBorder}>
					<Text style={{ textAlign: 'center' }}>{text}</Text>
					{showQR ? (
						<ButtonQR
							amountSatoshis={amount}
							toAddress={to}
							onClick={handleClick}
							step={step}
						>
							{price ? (
								<Text>
									{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
									<Small> {currency}</Small>
								</Text>
							) : (
								<Text>Badger Pay</Text>
							)}
						</ButtonQR>
					) : (
						<Button onClick={handleClick} step={step}>
							{price ? (
								<Text>
									{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
									<Small> {currency}</Small>
								</Text>
							) : (
								<Text>Badger Pay</Text>
							)}
						</Button>
					)}

					{showAmount && (
						<SatoshiText>
							<img
								src={BitcoinCashImage}
								style={{ height: 14, margin: 0 }}
								alt="BCH"
							/>{' '}
							BCH{' '}
							<span style={{ fontFamily: 'monospace' }}>
								{formatSatoshis(amount)}
							</span>
						</SatoshiText>
					)}
				</Wrapper>
			</Outer>
		);
	}
}

export default BadgerBase(BadgerButton);
