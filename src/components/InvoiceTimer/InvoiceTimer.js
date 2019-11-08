// @flow

import * as React from 'react';
import styled from 'styled-components';

const TimeText = styled.p`
	font-family: monospace;
	font-size: 12px;
	font-weight: 700;
	line-height: 10px;
	margin: 0;
	display: grid;
	text-align: left;
	color: ${({ alert = false }) => (alert === true ? 'red' : '#000')};
`;

// Invoice Timer

// Turn red if less than 1:00 left
// align right so alignment doesn't change when time goes from 10:00 to 9:59
// Only render if the invoice is active; not paid or expired
type Props = {
	secondsRemaining: ?number,
};

class InvoiceTimer extends React.PureComponent<Props> {
	render() {
		const { secondsRemaining } = this.props;
		let isAlert = false;

		let timeLeftMinutes = Math.floor(secondsRemaining / 60);
		let remainderSeconds = secondsRemaining % 60;

		if (timeLeftMinutes < 10) {
			timeLeftMinutes = '0' + timeLeftMinutes.toString();
			if (timeLeftMinutes < 1) {
				isAlert = true;
			}
		}

		if (remainderSeconds < 10) {
			remainderSeconds = '0' + remainderSeconds.toString();
		}

		return (
			<TimeText alert={isAlert}>
				{timeLeftMinutes}:{remainderSeconds}
			</TimeText>
		);
	}
}

export default InvoiceTimer;
