import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Web3Provider from './store/Web3Provider';
import { Web3ReactProvider } from '@web3-react/core';

import reportWebVitals from './utils/reportWebVitals';

import { getLibrary } from './utils/helper' ;

ReactDOM.render(
  <Web3Provider>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider> 
  </Web3Provider>,
  document.getElementById('root')
);

reportWebVitals();
