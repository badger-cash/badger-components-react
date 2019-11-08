// @flow

import * as React from 'react';
import styled from 'styled-components';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import SLPLogoImage from '../../images/slp-logo.png';

import { type ValidCoinTypes } from '../../hoc/BadgerBase';

import Small from '../../atoms/Small';
import InvoiceTimer from '../InvoiceTimer';

const Outer = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 5px;
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
	justify-content: ${({ timerShown = false }) =>
		timerShown === true ? 'space-between' : 'end'};
`;

const PriceText = styled.p`
	font-family: monospace;
	font-size: 16px;
	line-height: 12px;
	margin: 0;
	display: grid;
`;

// Price display
type Props = {
	price: ?string,
	symbol: string,

	coinType?: ValidCoinTypes,
	preSymbol?: string,
	name?: string,

	paymentRequestUrl?: string,
	invoiceTimeLeftSeconds?: number,
};

class PriceDisplay extends React.PureComponent<Props> {
	render() {
		const {
			price,
			name,
			coinType,
			symbol,
			preSymbol,
			paymentRequestUrl,
			invoiceTimeLeftSeconds,
		} = this.props;

		let isTimerShown = false;
		if (invoiceTimeLeftSeconds !== null) {
			isTimerShown = true;
		}

		const CoinImage = coinType === 'BCH' ? BitcoinCashImage : SLPLogoImage;

		const preContent = preSymbol ? (
			<PriceText>{preSymbol}</PriceText>
		) : (
			<div style={{ width: 25, height: 15 }}>
				<img src={CoinImage} style={{ height: '100%' }} alt={coinType} />
			</div>
		);
		const priceContent = paymentRequestUrl ? (
			<PriceText>BIP70 Invoice</PriceText>
		) : (
			<React.Fragment>
				<PriceText>{price || '-'}</PriceText>
				<Small>{symbol}</Small>
			</React.Fragment>
		);

		return (
			<Outer>
				<Top>
					{preContent}
					{priceContent}
				</Top>
				{name && (
					<Bottom timerShown={isTimerShown}>
						{invoiceTimeLeftSeconds !== null && (
							<InvoiceTimer
								secondsRemaining={invoiceTimeLeftSeconds}
							></InvoiceTimer>
						)}
						<Small muted>{name}</Small>
					</Bottom>
				)}
			</Outer>
		);
	}
}

export default PriceDisplay;
