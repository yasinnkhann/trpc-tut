import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { TRPCProvider } from './TRPCProvider';

const root = ReactDOM.createRoot(
	document.getElementById('root')! as HTMLElement
);

root.render(
	<React.StrictMode>
		<TRPCProvider>
			<App />
		</TRPCProvider>
	</React.StrictMode>
);
