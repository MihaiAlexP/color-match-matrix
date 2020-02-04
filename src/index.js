import React from 'react';
import ReactDOM from 'react-dom';
import Matrix from './components/matrix/Matrix';
import './styles/styles.scss';

import { SIZE, COLORS, initMatrix } from './utils/index';

ReactDOM.render(
  <Matrix matrix={initMatrix()} size={SIZE} colors={COLORS} />,
  document.getElementById('root')
);
