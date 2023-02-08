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
		address: string
	): Promise<TransactionStatus> => {
		// GET /address/:address/txs/mempool
		try {
			const res: Response = await fetch(
				`${this.baseUrl}/address/${address}/txs/mempool`
			);

			if (res.ok) {
				const txns = await res.json();

				if (txns.length === 0) {
					return Promise.reject('No transaction found');
				}

				let txout: { value: number } | undefined;

				const tx = txns.find((tx: any) => {
					txout = tx.vout.find((out: any) => {
						return out.scriptpubkey_address === address;
					});
					return txout !== undefined;
				});

				if (!tx || !txout) {
					return Promise.reject('No transaction found to our address');
				}

				return Promise.resolve({
					transactionId: tx.txid,
					amount_btc: txout.value / 100000000,
					confirmations: 0,
					status: 'pending',
					viewTransactionUrl: `${this.baseUrl.replace('/api/', '/')}tx/${
						tx.txid
					}`,
					transactionOutProof: 'unknown', // fixme
					transactionHash: 'unknown', // fixme
				});
			}

			throw new Error('Error fetching transaction');
		} catch (err) {
			return Promise.reject(err);
		}
	};

	watchTransactionStatus = async (
		_txid: string
	): Promise<TransactionStatus> => {
		return Promise.reject('Not implemented');
	};
}
