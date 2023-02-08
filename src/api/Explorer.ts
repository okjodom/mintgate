export interface Explorer {
	// Try get transaction status for a tx with given address
	watchAddessForTransaction: (
		address: string
	) => Promise<TransactionStatus | null>;

	// Try get transaction status for a tx with given address and transaction id.
	// Since we know the transaction id, this should be more efficient than watchAddessForTransaction
	watchTransactionStatus: (
		address: string,
		txid: string
	) => Promise<TransactionStatus>;

	// Try get transaction proof for a tx with given transaction id
	fetchTransactionProof: (txid: string) => Promise<TransactionProof>;
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
}

export interface TransactionProof {
	/** Merkle proof of transaction */
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
				});
			}

			throw new Error('Error fetching transaction');
		} catch (err) {
			return Promise.reject(err);
		}
	};

	watchTransactionStatus = async (
		address: string,
		txid: string
	): Promise<TransactionStatus> => {
		try {
			const res: Response = await fetch(`${this.baseUrl}/tx/${txid}`);

			if (res.ok) {
				const tx = await res.json();

				const txout = tx.vout.find((out: any) => {
					return out.scriptpubkey_address === address;
				});

				if (!txout) {
					return Promise.reject('No transaction found to our address');
				}

				return Promise.resolve({
					transactionId: tx.txid,
					amount_btc: txout.value / 100000000,
					confirmations: 2, // use block height to determing confirmations
					status: tx.status.confirmed ? 'confirmed' : 'pending',
					viewTransactionUrl: `${this.baseUrl.replace('/api/', '/')}tx/${
						tx.txid
					}`,
				});
			}

			throw new Error('Error fetching transaction');
		} catch (err) {
			return Promise.reject(err);
		}
	};

	fetchTransactionProof = async (txid: string): Promise<TransactionProof> => {
		try {
			const proofres: Response = await fetch(
				`${this.baseUrl}/tx/${txid}/merkleblock-proof`
			);

			const proof = proofres.ok && (await proofres.json());

			const hashres: Response = await fetch(`${this.baseUrl}/tx/${txid}/hex`);

			const hash = hashres.ok && (await hashres.json());

			if (!proof || !hash) {
				throw new Error('Error fetching transaction proof');
			}

			return Promise.resolve({
				transactionOutProof: proof,
				transactionHash: hash,
			});
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
