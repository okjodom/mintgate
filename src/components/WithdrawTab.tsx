import React, { useCallback, useEffect, useState } from 'react';
import {
	Box,
	HStack,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	TabPanel,
	Text,
	VStack,
} from '@chakra-ui/react';
import { TabHeader, Button, Input, ApiContext } from '.';
import { TransactionStatus } from '../api';

export const WithdrawTabHeader = () => {
	return <TabHeader>Withdraw</TabHeader>;
};

export interface TransactionTabProps {
	address: string;
	amount: number;
	txStatus: 'pending' | 'success' | 'failed';
	confirmationsRequired: number;
	federationId?: string;
	txId: string;
}

export interface ModalProps extends TransactionTabProps {
	open: boolean;
	onModalClick: () => void;
	onCloseClick: () => void;
	startWithdrawal: () => void;
}

interface WithdrawObject {
	amount: number;
	address: string;
}

export interface WithdrawTabProps {
	federationId: string;
}

const truncateStringFormat = (arg: string): string => {
	return `${arg.substring(0, 15)}......${arg.substring(
		arg.length,
		arg.length - 15
	)}`;
};

export const WithdrawTab = React.memo(function WithdrawTab({
	federationId,
}: WithdrawTabProps): JSX.Element {
	const { mintgate } = React.useContext(ApiContext);
	const [withdrawObject, setWithdrawObject] = useState<WithdrawObject>({
		amount: 0,
		address: '',
	});
	const [error, setError] = useState<string>('');
	const [modalState, setModalState] = useState<boolean>(false);
	const [transactionList, setTransactionList] = useState<
		Array<TransactionTabProps>
	>([]);
	const { amount, address } = withdrawObject;
	const [txId, setTxId] = useState<string>('');

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault();
			const { value, name } = event.target;

			setWithdrawObject((prevState) => ({ ...prevState, [name]: value }));
		},
		[withdrawObject]
	);

	const createWithdrawal = () => {
		if (!amount && amount === 0 && typeof amount === 'number') {
			setError('Amount cannot be empty or equal to zero');
			return;
		}
		if (!address) {
			setError('Amount or address cannot be empty');
			return;
		}
		// TODO: address validation
		setError('');
		setModalState(true);
	};

	const startWithdrawal = async () => {
		console.log('withdrawal created');
		try {
			const txId = await mintgate.requestWithdrawal(
				federationId,
				amount,
				address
			);

			console.log(txId, 'trasaction id:::');
			setTxId(txId);
			setTransactionList([
				...transactionList,
				{
					address,
					amount,
					confirmationsRequired: 3,
					federationId,
					txStatus: 'pending',
					txId,
				},
			]);
			setModalState(true);
		} catch (err) {
			console.log(err);
			setError('Failed to request withdrawal');
		}
	};

	return (
		<TabPanel ml='1px' mr='1px' p={{ bas: '4px', md: '16px', lg: '16px' }}>
			<Stack spacing='4' maxWidth={{ base: '100%', md: 'md', lg: 'md' }}>
				<Input
					labelName=' Amount:'
					placeHolder='Enter amount'
					value={withdrawObject.amount}
					onChange={(e) => handleInputChange(e)}
					name='amount'
				/>
				<Input
					labelName='Your address:'
					placeHolder='Enter wallet address '
					value={withdrawObject.address}
					onChange={(e) => handleInputChange(e)}
					name='address'
				/>

				{error && (
					<Box>
						<Text textAlign='center' color='red' fontSize='14'>
							Error: {error}
						</Text>
					</Box>
				)}

				<Button borderRadius='4' onClick={createWithdrawal}>
					Withdraw
				</Button>
			</Stack>

			<Stack pt='8'>
				{
					<>
						{transactionList.length !== 0 && (
							<>
								<Text color='#2d2d2d' fontSize='18px' fontWeight='600'>
									Transaction History
								</Text>
								<Box>
									{transactionList?.map((transaction) => {
										return (
											<TransactionTab
												key={transaction.federationId}
												{...transaction}
											/>
										);
									})}
								</Box>
							</>
						)}
					</>
				}
			</Stack>
			{modalState && (
				<TransactionModal
					open={modalState}
					onModalClick={() => {
						setModalState(false);
					}}
					onCloseClick={() => {
						setModalState(false);
					}}
					confirmationsRequired={3}
					amount={amount}
					address={address}
					txStatus='pending'
					startWithdrawal={startWithdrawal}
					txId={txId}
				/>
			)}
		</TabPanel>
	);
});

const TransactionModal = (props: ModalProps): JSX.Element => {
	const {
		open,
		onCloseClick,
		onModalClick,
		amount,
		address,
		startWithdrawal,
		txStatus,
	} = props;
	const [step, setStep] = useState<number>(0);

	return (
		<div>
			<>
				{step === 0 && (
					<Modal onClose={onModalClick} isOpen={open} isCentered>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Confirm Withdrawal</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<HStack justifyContent='space-between'>
									<Box>
										<Text>Transaction type:</Text>
										<Text>Withdrawal</Text>
									</Box>
									<Box>
										<Text>Status: </Text>
										<Text>{txStatus}</Text>
									</Box>
								</HStack>
								<VStack
									mt='4'
									alignItems='flex-start'
									justifyContent='space-between'
								>
									<Box>
										<Text>Amount:</Text>
										<Text>{amount} sats</Text>
									</Box>
									<Text>from</Text>
									<Box>
										<Text>Address:</Text>
										<Text>{truncateStringFormat(address)}</Text>
									</Box>
								</VStack>
							</ModalBody>
							<ModalFooter>
								<Button
									onClick={() => {
										if (startWithdrawal) {
											startWithdrawal();
											setStep(1);
										}
									}}
									fontSize={{ base: '12px', md: '13px', lg: '16px' }}
									p={{ base: '10px', md: '13px', lg: '16px' }}
								>
									Proceed
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}

				{step === 1 && (
					<Modal onClose={onModalClick} isOpen={open} isCentered>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader
								display='flex'
								alignItems='center'
								justifyContent='space-between'
							>
								Success
							</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Text>
									Withdrawal created created successfully, view transaction
									progress below
								</Text>
							</ModalBody>
							<ModalFooter>
								<Button
									onClick={onCloseClick}
									fontSize={{ base: '12px', md: '13px', lg: '16px' }}
									p={{ base: '10px', md: '13px', lg: '16px' }}
								>
									View Progress
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				)}
			</>
		</div>
	);
};

const TransactionTab = (props: TransactionTabProps): JSX.Element => {
	const { explorer } = React.useContext(ApiContext);
	const { confirmationsRequired, amount, address, txId, federationId } = props;
	const [txStatus, setTxStatus] = useState<TransactionStatus>();
	const [condition, setCondition] = useState<boolean>(false);
	const [details, setDetails] = useState<boolean>(false);

	const toggle = () => setDetails(!details);

	// track trnasactions
	useEffect(() => {
		const { watchTransactionStatus } = explorer;

		const watchWithdrawal = async (timer?: NodeJS.Timer) => {
			try {
				const currStatus = await watchTransactionStatus(address, txId);

				if (
					currStatus.status === 'confirmed' &&
					currStatus.confirmations === confirmationsRequired
				) {
					setCondition(true);
				}
				if (currStatus.confirmations === confirmationsRequired) {
					console.log('withdrawal successful');
					timer && clearInterval(timer);
				}

				setTxStatus(currStatus);
			} catch (e) {
				console.log(e);
			}
		};

		const timer = setInterval(async () => {
			await watchWithdrawal(timer);
		}, 5000);

		return clearInterval(timer);
	}, []);

	return (
		<Box
			borderRadius='8'
			maxWidth={{ base: '100%', md: 'md', lg: 'md' }}
			p={{ base: '2', md: '4', lg: '4' }}
			boxShadow='rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px'
			mb='4'
			cursor='pointer'
			onClick={toggle}
		>
			{/* Transaction Summary */}
			<>
				{!details && (
					<>
						<HStack justifyContent='space-between'>
							<Text fontWeight='600'>You withdrew {amount} sats</Text>
							<Text fontWeight='600'>${(amount / 4608.93).toFixed(2)}</Text>
						</HStack>
						<HStack mt='2' alignItems='baseline' justifyContent='space-between'>
							<Text fontSize='15px'>{new Date().toDateString()}</Text>
							<Text color={condition ? 'green' : 'red'} fontWeight='600'>
								{condition ? 'Success' : 'Failed'}
							</Text>
						</HStack>
					</>
				)}
			</>

			{/* Transaction History */}
			{details && (
				<>
					<Box textAlign='center'>
						<Text mt='8' mb='8' fontWeight='600'>
							You withdrew {amount} sats valued at $(
							{(amount / 4608.93).toFixed(2)})
						</Text>
						<TransactionInfo title='Federation ID' info={federationId} />
						<TransactionInfo
							title='Recipient'
							info={truncateStringFormat(address)}
						/>
						<TransactionInfo title='Transaction Type' info={'Withdrawal'} />
						<TransactionInfo
							title='Transaction ID'
							info={txId || txStatus?.transactionId}
						/>
						<TransactionInfo title='Confirmations' info='3' />
						<TransactionInfo
							title='Date | time'
							info={`${new Date().toDateString()} | ${new Date().toLocaleTimeString()}`}
						/>
						<TransactionInfo
							title='Status'
							info={condition ? 'Success' : 'Failed'}
							color={condition ? 'green' : 'red'}
						/>
						<HStack width='100%' mt='8' spacing='4'>
							<Button
								onClick={() => {
									console.log('clicked');
								}}
								width={{ base: '100%' }}
							>
								Share
							</Button>
							<Button
								onClick={() => {
									console.log('clicked');
								}}
								width={{ base: '100%' }}
							>
								Close
							</Button>
						</HStack>
					</Box>
				</>
			)}
		</Box>
	);
};

export interface TransactionInfoProps {
	title: string;
	info?: string | number;
	children?: React.ReactNode;
	onClick?: () => void;
	color?: string;
}

const TransactionInfo = (props: TransactionInfoProps): JSX.Element => {
	const { title, info, children, onClick, color } = props;
	return (
		<HStack
			borderBottom='1px solid #2d2d2d'
			pt='3'
			pb='3'
			alignItems='baseline'
			justifyContent='space-between'
		>
			<Text opacity={0.87} fontSize='15px' color='#2d2d2d'>
				{title}
			</Text>
			<Box>
				<Text onClick={onClick} fontWeight='500' color={color} fontSize='15px'>
					{info}
				</Text>
				{children}
			</Box>
		</HStack>
	);
};
