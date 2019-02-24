// @flow

import * as React from 'react';
import styled from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	formatAmount,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

import colors from '../../styles/colors';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import SLPLogoImage from '../../images/slp-logo.png';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
	type ValidCoinTypes,
} from '../../hoc/BadgerBase';

import PriceDisplay from '../PriceDisplay';

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
	coinName?: string,

	handleClick: Function,
	step: ButtonStates,
};

class BadgerButton extends React.PureComponent<Props> {
	static defaultProps = {
		showAmount: true,
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
			coinName,

			amount,
			showAmount,

			text,
			showBorder,
			showQR,
		} = this.props;

		const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

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

					{showAmount && <PriceDisplay coinType={coinType} price={formatAmount(amount, coinDecimals)} symbol={coinSymbol} name={coinName}/>}
						{/* <SatoshiText>
							<img
								src={CoinImage}
								style={{ height: 14, margin: 0 }}
								alt={coinType}
							/>{' '}
							{coinSymbol}{' '}
							<span style={{ fontFamily: 'monospace' }}>
								{formatAmount(amount, coinDecimals)}
							</span>
						</SatoshiText>
					)} */}
				</Wrapper>
			</Outer>
		);
	}
}

export default BadgerBase(BadgerButton);
