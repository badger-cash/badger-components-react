// @flow
import * as React from 'react';
import styled, { css } from 'styled-components';

import colors from '../styles/colors';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';

const ButtonElement = styled.button`

  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  outline: none;
  position: relative;
  color: ${colors.bg};

  ${(props) =>
		props.isFresh &&
		css`
			cursor: pointer;
      
			box-shadow: 1px 1px 1px ${colors.bchGrey};
			background-color: ${colors.brand500};
			
			transform: translateY(0px);
			&:hover {
				background-color: ${colors.brand700};
				color: ${colors.bg};
				box-shadow: 0px 0px 0px ${colors.bchGrey};
				transform: translateY(2px);
			}
		`}
`;


const cover = css`
	position: absolute;
  border: 1px solid ${colors.brand700};
	border-radius: 4px;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	font-size: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
`

const PendingCover = styled.div`
  ${cover};
  border-color: ${colors.pending700};
	background-color: ${colors.pending500};
`;

const CompleteCover = styled.div`
  ${cover};
  border-color: ${colors.succcess700};
  background-color: ${colors.success500};
`

type Props = {
	step: 'fresh' | 'pending' | 'complete',
	children: React.Node,
};

class Button extends React.PureComponent<Props> {
	render() {
		const { children, step } = this.props;

		const isFresh = step === 'fresh';
		const isPending = step === 'pending';
		const isComplete = step === 'complete';

		return (
			<ButtonElement
				disabled={!isFresh}
				isFresh={isFresh}
				isPending={isPending}
				isComplete={isComplete}
				{...this.props}
			>
				{children}
				{isPending && (
					<PendingCover>
						<FontAwesomeIcon icon={faSpinner} spin />
					</PendingCover>
				)}
        {isComplete && (
					<CompleteCover>
						<FontAwesomeIcon icon={faCheck} />
					</CompleteCover>
				)}
			</ButtonElement>
		);
	}
}

export default Button;
