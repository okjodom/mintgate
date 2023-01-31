export interface Explorer {
	watchAddessForTransaction: (
		address: string
	) => Promise<TransactionStatus | null>;

	watchTransactionStatus: (txid: string) => Promise<TransactionStatus>;
}

export interface TransactionStatus {
	/** transaction id */
	transactionId: string;
	/** amount detected in transaction */
	amount_btc: number;
	/** number of confirmations */
	confirmations: number;
	/** status of the transaction */
	status: 'pending' | 'confirmed';
	/** Url to view this transaction on the explorer where status information was sourced */
	viewTransactionUrl: string;
	/** Proof of transaction */
	transactionOutProof: string;
	/** Sha256 hash of transaction */
	transactionHash: string;
}

export class BlockstreamExplorer implements Explorer {
	// Base url for the blockstream explorer
	public baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	watchAddessForTransaction = async (
		_address: string
	): Promise<TransactionStatus> => {
		return Promise.reject('Not implemented');
	};

	watchTransactionStatus = async (
		_txid: string
	): Promise<TransactionStatus> => {
		return Promise.reject('Not implemented');
	};
}
