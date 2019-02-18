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
				repeatTimeout={number('repeat timeout (ms)', 4000)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				successFn={() => console.log('success example function called')}
				failFn={() => console.log('fail example function called')}
				text={text('Top Text', 'Badger Pay')}
				showSatoshis={boolean('Toggle Satoshis', true)}
				showBorder={boolean('Toggle Border', true)}
				showQR={boolean('Show QR', false)}
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
		'optional QR code',
		() => (
			<BadgerButton
				amount={0.0001}
				showQR={boolean('show QR', true)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Optional use a QR code in addition to Button',
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
	).add(
		'repeatable payments',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				isRepeatable={boolean('Repeatable payment', true)}
				repeatTimeout={number('Reset Timeout (ms)', 5000)}
			/>
		),
		{
			notes:
				'Payments which can happen more than once on a single page visit.  Games for example',
		}
	).add(
		'Watch all sources',
		() => (
			<BadgerButton
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				watchAddress={boolean('watch Address', true)}
			/>
		),
		{
			notes:
				'if watchAddress is true, the payment will turn to confirmed when the address receives a payment from any source.  Including other people.  This is ideal to use if the payment codes are unique for the checkout.  Not great if the payment address is shared by users.',
		}
	);
