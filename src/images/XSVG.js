// @flow

import React from 'react';
import styled from 'styled-components';

import colors from '../styles/colors';

const Svg = styled.h4`
	color: ${colors.expired700};
`;

const XSVG = () => <Svg>Expired</Svg>;

export default XSVG;
