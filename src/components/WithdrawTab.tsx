import React, { useCallback, useEffect, useState } from 'react';
import {
	Box,
	Flex,
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
	useToast,
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
	txStatus: 'pending' | 'confirmed';
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
				{
					address,
					amount,
					confirmationsRequired: 3,
					federationId,
					txStatus: 'pending',
					txId,
				},
				...transactionList,
			]);
			setWithdrawObject({ ...withdrawObject, amount: 0, address: '' });
			setModalState(false);
		} catch (err) {
			console.log(err);
			setError('Failed to request withdrawal');
		}
	};

	return (
		<TabPanel ml='1px' mr='1px' p={{ base: '4px', md: '16px', lg: '16px' }}>
			<Stack spacing='4' maxWidth={{ base: '100%', md: 'md', lg: 'md' }}>
				<Input
					labelName=' Amount (sats):'
					placeHolder='Enter amount in sats'
					value={withdrawObject.amount}
					onChange={(e) => handleInputChange(e)}
					name='amount'
				/>
				<Input
					labelName='Your address:'
					placeHolder='Enter your btc address '
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
	const { open, onModalClick, amount, address, startWithdrawal } = props;
	const toast = useToast();

	return (
		<div>
			<>
				<Modal onClose={onModalClick} isOpen={open} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Confirm Withdrawal</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<VStack alignItems='flex-start' justifyContent='space-between'>
								<Box>
									<Text>Amount:</Text>
									<Text>{amount} sats</Text>
								</Box>
								<Text>to</Text>
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
										toast({
											title: 'Withdrawal created.',
											description: 'Please check your transaction history',
											status: 'success',
											duration: 5000,
											isClosable: true,
											position: 'top-right',
										});
									}
								}}
								fontSize={{ base: '12px', md: '13px', lg: '16px' }}
								p={{ base: '10px', md: '13px', lg: '16px' }}
							>
								Confirm
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
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
			<>
				{!details && (
					<>
						<HStack justifyContent='space-between'>
							<Text fontWeight='600'>Requested withdrawal</Text>
							<Text fontWeight='600'>{amount} sats</Text>
						</HStack>
						<HStack mt='2' alignItems='baseline' justifyContent='space-between'>
							<Text fontSize='15px'>{new Date().toDateString()}</Text>
							<Text color={condition ? 'green' : 'orange'} fontWeight='600'>
								{condition ? 'Confirmed' : 'Pending'}
							</Text>
						</HStack>
					</>
				)}
			</>

			{details && (
				<>
					<Box textAlign='center'>
						<Text mt='8' mb='8' fontWeight='600'>
							Requested withdrawal from {federationId}
						</Text>
						<TransactionInfo title='Amount' info={`${amount} sats`} />
						<TransactionInfo
							title='Address'
							info={truncateStringFormat(address)}
						/>
						<TransactionInfo
							title='Transaction ID'
							info={txId || txStatus?.transactionId}
						/>
						<TransactionInfo
							title='Confirmations'
							info={`${txStatus?.confirmations ?? 0} |`}
						>
							<Text fontWeight='600' color={condition ? 'green' : 'orange'}>
								{condition ? ' confirmed' : ' pending'}
							</Text>
						</TransactionInfo>
						<TransactionInfo
							title='Date | time'
							info={`${new Date().toDateString()} | ${new Date().toLocaleTimeString()}`}
						/>
						<HStack width='100%' mt='8' spacing='4'>
							<Button
								onClick={() => {
									window.open(txStatus?.viewTransactionUrl);
								}}
								width={{ base: '100%' }}
							>
								View
							</Button>
							<Button
								onClick={() => {
									setDetails(false);
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
			<Flex gap='4px' alignItems='center'>
				<Text onClick={onClick} fontWeight='500' color={color} fontSize='15px'>
					{info}
				</Text>
				{children}
			</Flex>
		</HStack>
	);
};
