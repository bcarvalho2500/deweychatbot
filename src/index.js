import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Auth0Provider } from '@auth0/auth0-react'
import history from './utils/history';

const onRedirectCallback = (appState) => {
	history.replace(
		appState && appState?.returnTo
			? appState?.returnTo
			: window.location.pathname
	)
	history.go(0)
}

const providerConfig = {
	domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
	redirectUri: window.location.origin,
	onRedirectCallback: onRedirectCallback,
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter history={history}>
      <Auth0Provider {...providerConfig}>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
