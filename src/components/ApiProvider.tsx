import React from 'react';
import { Mintgate, MockMintgate } from '../api';

interface ApiContextProps {
	// API to interact with the Gateway server
	mintgate: Mintgate;
}

export const ApiContext = React.createContext<ApiContextProps>({
	mintgate: new MockMintgate(),
});

export const ApiProvider = React.memo(function ApiProvider({
	props,
	children,
}: {
	props: ApiContextProps;
	children: React.ReactNode;
}): JSX.Element {
	return <ApiContext.Provider value={props}>{children}</ApiContext.Provider>;
});
