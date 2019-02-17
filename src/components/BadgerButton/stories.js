// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, select, text, boolean, number } from '@storybook/addon-knobs';

import BadgerButton from './BadgerButton';
import { currencyOptions } from '../../utils/currency-helpers';

const defaultOpReturn = [
	'0x6d02',
	'Learn to build on BCH at https://developer.bitcoin.com',
];

storiesOf('BadgerButton', module)
	.add(
		'default',
		() => (
			<BadgerButton
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
			/>
		),
		{
			notes:
				'Basic Badger Button.  Perfect for adding Badger integration to an existing flow, or in a minimal way.  Default has all the knobs to play with',
		}
	)
	.add(
		'all knobs',
		() => (
			<BadgerButton
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				isRepeatable={boolean('repeatable', true)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
				text={text('Top Text', 'Badger Pay')}
				showSatoshis={boolean('Toggle Satoshis', true)}
				showBorder={boolean('Toggle Border', true)}
			/>
		),
		{
			notes:
				'Play with all the props in the knobs tab to try out what BadgerButtons can do',
		}
	)
	.add(
		'price in BCH',
		() => (
			<BadgerButton
				ticker={'BCH'}
				amount={number('BCH amount', 0.001)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Without a text prop, it only shows the price',
		}
	)
	.add(
		'optional text',
		() => (
			<BadgerButton
				price={0.001}
				currency={'USD'}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
			/>
		),
		{
			notes: 'Without a text prop, it only shows the price',
		}
	)
	.add(
		'currency variety',
		() => (
			<BadgerButton
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				text="Pay with Badger"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	)
	.add(
		'toggle Satoshis',
		() => (
			<BadgerButton
				showSatoshis={boolean('Toggle Satoshis', false)}
				price={0.001}
				currency={'USD'}
				text="Pay now"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	)
	.add(
		'toggle border',
		() => (
			<BadgerButton
				price={0.001}
				showBorder={boolean('Toggle Border', true)}
				currency={'USD'}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	)
	.add(
		'OP_RETURN',
		() => (
			<BadgerButton
				price={0.001}
				currency={'USD'}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				text="With OP_RETURN"
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Change the currency and price',
		}
	);
