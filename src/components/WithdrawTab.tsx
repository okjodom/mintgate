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
	Progress,
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
	txStatus: TransactionStatus | null;
	confirmationsRequired: number;
	federationId?: string;
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
			setTransactionList([
				...transactionList,
				{
					address,
					amount,
					confirmationsRequired: 3,
					federationId,
					txStatus: null,
				},
			]);
			setModalState(true);
		} catch (err) {
			console.log(err);
			setError('Failed to request withdrawal');
		}
	};

	return (
		<TabPanel>
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
						<Text>Transaction History</Text>
						<Box>
							{transactionList?.map((transaction) => {
								return <TransactionTab {...transaction} />;
							})}
						</Box>
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
					txStatus={null}
					startWithdrawal={startWithdrawal}
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
										<Text>{txStatus?.status}</Text>
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
	const { confirmationsRequired, amount, address, txStatus } = props;

	// track trnasactions
	useEffect(() => {
		const { watchTransactionStatus } = explorer;

		const watchWithdrawal = async (timer?: NodeJS.Timer) => {
			try {
				const currStatus = await watchTransactionStatus(
					address,
					txStatus?.transactionId ?? ''
				);

				if (currStatus.confirmations === confirmationsRequired) {
					console.log('withdrawal created');
					timer && clearInterval(timer);
				}
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
			borderRadius='4'
			border={confirmationsRequired >= 3 ? '1px solid green' : '1px solid red'}
		>
			<HStack>
				<Text>transaction type</Text>
				<Text>Withdrawal</Text>
				<Text>Status: {txStatus?.status}</Text>
			</HStack>
			<HStack>
				<Text>{amount}</Text>
				<Text>to</Text>
				<Text>{truncateStringFormat(address)}</Text>
			</HStack>
			<HStack>
				<Flex>
					<Text>confirmations required</Text>
					<Text>{confirmationsRequired}</Text>
				</Flex>
				<Progress
					value={100 / confirmationsRequired}
					size='xs'
					colorScheme='orange'
					hasStripe
					mb={2}
				/>
			</HStack>
			<Flex>
				<Text>{txStatus?.transactionId}</Text>
			</Flex>
		</Box>
	);
};
