import { configure, addDecorator } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs'

// automatically import all files ending in *.stories.js
const req = require.context('../src', true,  /[^/]+\/stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(withNotes);
addDecorator(withKnobs);

configure(loadStories, module);
