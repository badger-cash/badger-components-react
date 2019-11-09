// @flow

import React from 'react';
import styled from 'styled-components';

import colors from '../styles/colors';

const ExpiredLabel = styled.h5`
	color: ${colors.expired700};
	text-align: center;
`;

const XSVG = () => (
	<React.Fragment>
		<ExpiredLabel>Invoice Expired</ExpiredLabel>
	</React.Fragment>
);

export default XSVG;
