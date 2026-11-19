import React from 'react';
import ReactDOM from 'react-dom';
import './app/index.css';
import App from './app/App';
import ClawswapBar from './clawswap/ClawswapBar';

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* clawswap's controls, only on the dev server: the GitHub Pages build leaves them out. */}
    {process.env.NODE_ENV === 'development' && <ClawswapBar />}
  </React.StrictMode>,
  document.getElementById('root')
);

