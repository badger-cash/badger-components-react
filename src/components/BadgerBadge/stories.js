// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, boolean, number, select, text } from '@storybook/addon-knobs';

import BadgerBadge from './BadgerBadge';

import { currencyOptions } from '../../utils/currency-helpers';

const defaultOpReturn = [
	'0x6d02',
	'Try out Badger at https://badger.bitcoin.com',
];

storiesOf('BadgerBadge', module)
	.add(
		'all knobs',
		() => (
			<BadgerBadge
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				tag={text('Button Text', 'Badger Pay')}
				text={text('Top Text', 'Payment Total')}
				isRepeatable={boolean('Repeatable payment', false)}
				repeatTimeout={number('Repeat Timeout (ms)', 4000)}
				watchAddress={boolean('Watch Address All', true)}
				showBrand={boolean('Toggle Brand', false)}
				showSatoshis={boolean('Toggle Satoshis', true)}
				showQR={boolean('Toggle QR', true)}
				showBorder={boolean('Toggle Border', false)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes:
				'Badger Badges are perfect for showing the price and Satoshis in a simple clean all in one component.  Default has knobs to experiment with all settings',
		}
	)
	.add(
		'price in BCH',
		() => (
			<BadgerBadge
				ticker="BCH"
				amount={number('BCH Amount', 0.0001)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes:
				'Badger Badges are perfect for showing the price and Satoshis in a simple clean all in one component.  Default has knobs to experiment with all settings',
		}
	)
	.add(
		'custom text',
		() => (
			<BadgerBadge
				price={0.001}
				currency={'USD'}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				tag={text('Button Text', 'And the CTA')}
				text={text('Top Text', 'Customize the Title')}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes: 'Customize the title and button text',
		}
	)
	.add(
		'currency variety',
		() => (
			<BadgerBadge
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes: 'Pay in any currency, and automagically convert the amount to BCH',
		}
	)
	.add(
		'toggle QR code',
		() => (
			<BadgerBadge
				price={number('Price', 0.001)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				showQR={boolean('Toggle QR', false)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes:
				'Badger Badges are perfect for showing the price and Satoshis in a simple clean all in one component.  Default has knobs to experiment with all settings',
		}
	)
	.add(
		'toggle satoshis',
		() => (
			<BadgerBadge
				price={0.001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				showSatoshis={boolean('Show Satoshis', false)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes: 'Choose to show the Satoshi amount alongside the currency amount',
		}
	)
	.add(
		'toggle badger info',
		() => (
			<BadgerBadge
				price={0.001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				showBrand={boolean('Badger info', true)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes: 'Choose to display a link to the Badger homepage',
		}
	)
	.add(
		'toggle border',
		() => (
			<BadgerBadge
				price={0.001}
				showBorder={boolean('Toggle Border', true)}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
			/>
		),
		{
			notes: 'Toggle border',
		}
	)
	.add(
		'repeatable payments',
		() => (
			<BadgerBadge
				price={number('Price', 0.001)}
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
	)
	.add(
		'payment functions',
		() => (
			<BadgerBadge
				price={0.001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				successFn={() => alert('Custom Success function called')}
				failFn={() => alert('Custom Fail / Cancel function called ')}
			/>
		),
		{
			notes: 'Custom functions called on Successful and Failed payments',
		}
	)
	.add(
		'OP_RETURN',
		() => (
			<BadgerBadge
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
			notes: 'Modify the OP_RETURN value when paid with Badger wallet',
		}
	)
	.add(
		'Watch payments from all sources',
		() => (
			<BadgerBadge
				amount={0.0001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				watchAddress={boolean('watch Address All', true)}
			/>
		),
		{
			notes:
				'if watchAddress is true, the payment will turn to confirmed when the address receives a payment from any source.  Including other people.  This is ideal to use if the payment codes are unique for the checkout.  Not great if the payment address is shared by users.',
		}
	);
