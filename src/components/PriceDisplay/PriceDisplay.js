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

import {
	// type ButtonStates,
	// type BadgerBaseProps,
	type ValidCoinTypes,
} from '../../hoc/BadgerBase';

// import Button from '../../atoms/Button';
// import ButtonQR from '../../atoms/ButtonQR';
import Small from '../../atoms/Small';
import Text from '../../atoms/Text';

// const SatoshiText = styled.p`
// 	font-size: 12px;
// 	margin: 0;
// 	display: grid;
// 	grid-template-columns: max-content max-content max-content;
// 	justify-content: end;
// 	grid-gap: 5px;
// 	align-items: center;
// `;

const Outer = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 5px;
	/* grid-auto-flow: column;
	justify-content: end;
	align-items: end; */
`;

const Top = styled.div`
	grid-template-columns: max-content max-content max-content;
	display: grid;
	grid-gap: 5px;
	grid-auto-flow: column;
	justify-content: end;
	align-items: end;
`;

const Bottom = styled.div`
	display: flex;
	justify-content: flex-end;
	/* column-span: 3; */
`;

// const Wrapper = styled.div`
// 	display: grid;
// 	grid-gap: 5px;
// 	font-family: sans-serif;
// 	grid-template-columns: max-content;
// 	grid-template-rows: max-content max-content max-content;
// 	color: ${colors.fg500};
// 	padding: 6px;
// 	border: ${(props) =>
// 		props.hasBorder ? `1px dashed ${colors.brand700}` : 'none'};
// 	border-radius: 4px;
// `;

const PriceText = styled.p`
	font-family: monospace;
	font-size: 16px;
	line-height: 12px;
	margin: 0;
	display: grid;
	/* grid-gap: 5px; */
	/* grid-auto-flow: column;
	justify-content: flex-end;
	align-items: center; */
`;

// Price display
type Props = {
	price: string,
	symbol: string,

	coinType?: ValidCoinTypes,
	preSymbol?: string,
	name?: string,
};

class PriceDisplay extends React.PureComponent<Props> {
	render() {
		const { price, name, coinType, symbol, preSymbol } = this.props;

		const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

		const preContent = preSymbol ? (
			<PriceText>{preSymbol}</PriceText>
		) : (
			<img src={CoinImage} style={{ height: '100%' }} alt={coinType} />
		);

		return (
			<Outer>
				<Top>
					{preContent}
					<PriceText>{price}</PriceText>
					<Small>{symbol}</Small>
				</Top>
				{name && (
					<Bottom>
						<Small muted>{name}</Small>
					</Bottom>
				)}
			</Outer>
		);
	}
}

export default PriceDisplay;
