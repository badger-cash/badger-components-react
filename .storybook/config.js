import { configure, addDecorator } from '@storybook/react';
import { themes } from '@storybook/components';

import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs'
import { withOptions } from '@storybook/addon-options';

// automatically import all files ending in *.stories.js
const req = require.context('../src', true,  /[^/]+\/stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withNotes);
addDecorator(withKnobs);


addDecorator(
  withOptions({
    name: 'Badger Components React',
    theme: {...themes.normal}
  })
);

configure(loadStories, module);
