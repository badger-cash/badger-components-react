// @flow

import React from 'react';
import styled from 'styled-components';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { select, text, boolean, number } from '@storybook/addon-knobs';

import ButtonQR from './ButtonQR';
import Text from '../Text';

const ButtonText = 'Badger Pay';
const props = {
	toAddress: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g',
	amountSatoshis: 550,
};

storiesOf('ButtonQR', module)
	.add(
		'default - all knobs',
		() => (
			<ButtonQR
				toAddress={text(
					'To address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				amountSatoshis={number('Satoshis', 550)}
				sizeQR={number('QR size', 125)}
				step={'fresh'}
			>
				<Text>{ButtonText}</Text>
			</ButtonQR>
		),
		{
			notes:
				'Button is a stateful controlled component which is the primary visual indicator for the badger payment process',
		}
	)
	.add(
		'payment pending',
		() => (
			<ButtonQR {...props} step={'pending'}>
				<Text>{ButtonText}</Text>
			</ButtonQR>
		),
		{
			notes: 'Awaitng a confirmation or cancellation of Badger popup',
		}
	)
	.add(
		'payment complete',
		() => (
			<ButtonQR {...props} step={'complete'}>
				<Text>{ButtonText}</Text>
			</ButtonQR>
		),
		{
			notes: 'Awaitng a confirmation or cancellation of Badger popup',
		}
	)
	.add(
		'login prompt',
		() => (
			<ButtonQR {...props} step={'login'}>
				<Text>{ButtonText}</Text>
			</ButtonQR>
		),
		{
			notes: 'user not logged in, prompt to login',
		}
	)
	.add(
		'install prompt',
		() => (
			<ButtonQR {...props} step={'install'}>
				<Text>{ButtonText}</Text>
			</ButtonQR>
		),
		{
			notes: 'Badger plugin not installed, prompt user to install Badger',
		}
	);
