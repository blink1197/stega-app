import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootDOM = document.getElementById('root');
rootDOM.style.width = '100vw';
rootDOM.style.height = '100vh';
rootDOM.style.background = '#94A3B8';

const root = ReactDOM.createRoot(rootDOM);

root.render(

    <App />

);

reportWebVitals();