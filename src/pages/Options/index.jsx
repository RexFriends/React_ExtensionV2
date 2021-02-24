import React from 'react';
import { render } from 'react-dom';

import Options from './Options.jsx';
import './index.css';

render(
  <Options title={'settings'} />,
  window.document.querySelector('#app-container')
);
