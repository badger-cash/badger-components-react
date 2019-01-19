// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { select, text, boolean, number } from '@storybook/addon-knobs';

import BadgerButton from './BadgerButton';

const currencyOptions = ['USD', 'CAD', 'HKD', 'JPY', 'GBP', 'EUR', 'CNY'];
storiesOf('BadgerButton', module).add(
	'default',
	() => (
		<BadgerButton
			price={number('Price', 0.001)}
			currency={select('Currency', currencyOptions, 'USD')}
			to={text(
				'To Address',
				'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
			)}
			text={text('Top Text', 'Badger Pay')}
			showSatoshis={boolean('Show Satoshis', true)}
			successFn={() => console.log('success')}
			failFn={() => console.log('fail')}
		/>
	),
	{
		notes:
			'Basic Badger Button.  Perfect for adding Badger integration to an existing flow, or in a minimal way.  Default has all the knobs to play with',
	}
).add(
	'without text',
	() => (
		<BadgerButton
			price={0.01}
			currency={'USD'}
			to={text(
				'To Address',
				'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
			)}
		/>
	),
	{
		notes:
			'Without a text prop, it only shows the price',
	}
).add(
	'currencies',
	() => (
		<BadgerButton
			price={number('Price', 0.01)}
			currency={select('Currency', currencyOptions, 'USD')}
			text="Pay with Badger"
			to={text(
				'To Address',
				'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
			)}
		/>
	),
	{
		notes:
			'Change the currency and price',
	}
)
.add(
	'hide the satoshi amount',
	() => (
		<BadgerButton
			showSatoshis={boolean('Show Satoshis', false)}
			price={0.01}
			currency={'USD'}
			text="Pay now"
			to={text(
				'To Address',
				'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
			)}
		/>
	),
	{
		notes:
			'Change the currency and price',
	}
);
