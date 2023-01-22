import { Federation } from '../federation.types';

// Mintgate is an API to interact with the Gateway server
export interface Mintgate {
	fetchInfo: () => Promise<GatewayInfo>;
}

// GatewayInfo is the information returned by the Gateway server
export interface GatewayInfo {
	version_hash: string;
	federations: Federation[];
}

// NullGatewayInfo is a placeholder for when the GatewayInfo is not yet loaded
export const NullGatewayInfo: GatewayInfo = {
	version_hash: '',
	federations: [],
};
