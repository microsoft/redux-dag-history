import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'skeleton-css/css/normalize.css';
import 'skeleton-css/css/skeleton.css';
import './app.scss';
import store from './state/store';
import Application from './components/Application';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Application store={store} />, root);
