// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { array, boolean, number, select, text } from '@storybook/addon-knobs';

import BadgerBadge from './BadgerBadge';

import { currencyOptions } from '../../utils/currency-helpers';

const defaultOpReturn = ['0x6d02', 'Hello BadgerBadge']

storiesOf('BadgerBadge', module)
	.add(
		'default',
		() => (
			<BadgerBadge
				price={number('Price', 0.001)}
				currency={select('Currency', currencyOptions, 'USD')}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				opReturn={array('OP_RETURN', defaultOpReturn)}
				tag={text('Button Text', 'Pay')}
				text={text('Top Text', 'Payment Total')}
				showBrand={boolean('Show Brand', true)}
				showSatoshis={boolean('Show Satoshis', true)}
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
		'optionally satoshis',
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
		'optionally badger info',
		() => (
			<BadgerBadge
				price={0.001}
				to={text(
					'To Address',
					'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
				)}
				showBrand={boolean('Badger info', false)}
				successFn={() => console.log('success')}
				failFn={() => console.log('fail')}
			/>
		),
		{
			notes: 'Choose to display a link to the Badger homepage',
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
			notes: 'Custom functions called on Successfull and Failed payments',
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
			notes: 'Change the currency and price',
		}
	);
