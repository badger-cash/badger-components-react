// @flow

import * as React from 'react';
import styled, { css } from 'styled-components';

import {
	getCurrencyPreSymbol,
	formatPriceDisplay,
	formatAmount,
} from '../../utils/badger-helpers';

import { type CurrencyCode } from '../../utils/currency-helpers';

import BadgerBase, {
	type ButtonStates,
	type BadgerBaseProps,
	type ValidCoinTypes,
} from '../../hoc/BadgerBase';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import SLPLogoImage from '../../images/slp-logo.png'

import colors from '../../styles/colors';

import Button from '../../atoms/Button';
import ButtonQR from '../../atoms/ButtonQR';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const Outer = styled.div`
	display: grid;
	grid-template-columns: max-content;
`;

const Main = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 20px;
	padding: 12px 12px 6px;

	${(props) =>
		props.showBorder &&
		css`
			border: 1px dashed ${colors.brand500};
			border-radius: 4px;
		`}
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
	display: grid;
	grid-gap: 5px;
	grid-auto-flow: column;
	justify-content: flex-end;
	align-items: center;
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
	step: ButtonStates,

	showAmount?: boolean,
	coinSymbol: string,
	coinAmount: number,
	coinDecimals?: number,

	showBrand?: boolean,
	showQR?: boolean,
	showBorder?: boolean,

	handleClick: Function,
};

class BadgerBadge extends React.PureComponent<Props> {
	static defaultProps = {
		currency: 'USD',
		tag: 'Badger Pay',
		text: 'Payment Total',
		showAmount: true,
		showBrand: false,
		showQR: true,
		showBorder: false,
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

			text,
			tag,

			showAmount,
			showQR,
			showBorder,
			showBrand,
		} = this.props;

		const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

		return (
			<Outer>
				<Main showBorder={showBorder}>
					<HeaderText>{text}</HeaderText>
					<Prices>
						{price && (
							<>
								<PriceText style={{ textAlign: 'right' }}>
									{getCurrencyPreSymbol(currency)}
									{formatPriceDisplay(price)}{' '}
								</PriceText>
								<Small>{currency}</Small>
							</>
						)}
						{showAmount && (
							<>
								<PriceText>
									<img
										src={CoinImage}
										style={{ height: 14 }}
										alt={coinType}
									/>{' '}
									{formatAmount(amount, coinDecimals)}
								</PriceText>
								<Small>{coinSymbol}</Small>
							</>

						)}
					</Prices>
					<ButtonContainer>
						{showQR ? (
							<ButtonQR
								onClick={handleClick}
								step={step}
								amountSatoshis={amount}
								toAddress={to}
							>
								<Text>{tag}</Text>
							</ButtonQR>
						) : (
							<Button onClick={handleClick} step={step}>
								<Text>{tag}</Text>
							</Button>
						)}

						{(step === 'install' || showBrand) && (
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
			</Outer>
		);
	}
}

export default BadgerBase(BadgerBadge);
