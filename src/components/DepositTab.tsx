import React, { useEffect, useState } from 'react';
import {
	TabPanel,
	Stack,
	Card,
	CardBody,
	CardFooter,
	Image,
	Heading,
	Text,
	Spacer,
	Flex,
	Progress,
	Badge,
	Box,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { ApiContext, Button, TabHeader } from '.';

export const DepositTabHeader = (): JSX.Element => {
	return <TabHeader>Deposit</TabHeader>;
};

enum DepositStatus {
	Address,
	Pending,
	Complete,
}

const truncateStringFormat = (arg: string): string => {
	return `${arg.substring(0, 15)}......${arg.substring(
		arg.length,
		arg.length - 15
	)}`;
};

export const DepositTab = React.memo(function DepositTab(): JSX.Element {
	const { mintgate } = React.useContext(ApiContext);
	const [depositStatus, setDepositStatus] = useState<DepositStatus>(
		DepositStatus.Address
	);
	const [address, setAddress] = useState<string>('');

	useEffect(() => {
		mintgate.fetchAddress().then((newAddress) => {
			setAddress(newAddress);
		});
	}, [mintgate]);

	const mock_txid =
		'de3d5bf1e3c1b3be2a1e025825f751629390ad60c8f91723e330f2356d99c59b';

	const handleCompleteTransaction = async () => {
		// TODO: Call to completeDeposit should be automated.
		// once all the required data is available, complete the deposit without requiring user interaction.
		const fmTxId = await mintgate.completeDeposit(
			'' /*federationId */,
			'' /*txOutProof*/,
			'' /*tx*/
		);

		console.log('Fedimint Transaction ID: ', fmTxId);

		setDepositStatus(DepositStatus.Complete);
	};

	const getDepositCardProps = (): DepositCardProps => {
		switch (depositStatus) {
		case DepositStatus.Address:
			return {
				content: <ShowDepositAddress address={address} />,
				actions: [
					{
						label: 'Share Address',
						onClick: () => setDepositStatus(DepositStatus.Pending),
					},
					{
						label: 'Copy Address',
						onClick: () => setDepositStatus(DepositStatus.Pending),
					},
				],
				infographic: {
					qrStr: address,
				},
			};
		case DepositStatus.Pending:
			return {
				content: (
					<ShowTransaction
						{...{
							address,
							txid: mock_txid,
							amount_btc: 0.00013813,
							confirmations: 1,
							confirmationsRequired: 3,
						}}
					/>
				),
				actions: [
					{
						label: 'View Transaction',
						onClick: () =>
							window.open(`https://mempool.space/tx/${mock_txid}`, '_blank'),
					},
					{
						// TODO: Remove this simulation button
						label: 'Complete',
						onClick: () => handleCompleteTransaction(),
					},
				],
				infographic: {
					imgUrl:
							'https://www.maxpixel.net/static/photo/1x/Bitcoin-Logo-Bitcoin-Icon-Bitcoin-Btc-Icon-Currency-6219384.png',
					altText: 'Pending bitcoin transaction',
				},
			};
		case DepositStatus.Complete:
			return {
				content: (
					<ShowTransaction
						{...{
							address,
							txid: mock_txid,
							amount_btc: 0.00013813,
							confirmations: 3,
							confirmationsRequired: 3,
						}}
					/>
				),
				actions: [
					{
						label: 'Close',
						onClick: () => setDepositStatus(DepositStatus.Address),
					},
				],
				infographic: {
					imgUrl:
							'https://iconarchive.com/download/i104526/cjdowner/cryptocurrency/Bitcoin.ico',
					altText: 'Bitcoin Address QR Code',
				},
			};
		}
	};

	return (
		<TabPanel pl='8px' pr='8px'>
			<DepositCard {...getDepositCardProps()} />
		</TabPanel>
	);
});

interface DepositCardProps {
	content: JSX.Element;
	actions?: DepositCardAction[];
	infographic?: ImageRenderer | QRCodeRenderer;
}

interface DepositCardAction {
	label: string;
	onClick: () => void;
}

interface ImageRenderer {
	imgUrl: string;
	altText: string;
}

interface QRCodeRenderer {
	qrStr: string;
}

const isQrCodeRenderer = (
	renderer: ImageRenderer | QRCodeRenderer
): renderer is QRCodeRenderer => {
	return 'qrStr' in renderer;
};

export const DepositCard = React.memo(function DepositCard(
	props: DepositCardProps
): JSX.Element {
	const { content, actions, infographic } = props;

	return (
		<Card overflow='hidden' variant='unstyled'>
			<Stack alignItems='center' flexDir={{ base: 'column', md: 'row' }}>
				<CardBody>{content}</CardBody>
				{infographic && (
					<>
						{isQrCodeRenderer(infographic) ? (
							<Box width='250px' height='100%'>
								<QRCodeSVG
									height='100%'
									width='100%'
									value={infographic.qrStr}
								/>
							</Box>
						) : (
							<Image
								objectFit='cover'
								maxW={{ base: '200px', sm: '200px' }}
								src={infographic.imgUrl}
								alt={infographic.altText}
							/>
						)}
					</>
				)}
			</Stack>
			<CardFooter
				justifyContent={{ base: 'space-between', md: 'normal' }}
				pt={{ base: 6, md: 2, lg: 2 }}
				gap='6'
			>
				{actions?.map((action: DepositCardAction, i: number) => {
					return (
						<Button
							fontSize={{ base: '12px', md: '13px', lg: '16px' }}
							onClick={action.onClick}
							key={i}
							width={{ base: '100%', md: 'fit-content' }}
						>
							{action.label}
						</Button>
					);
				})}
			</CardFooter>
		</Card>
	);
});

interface ShowDepositAddressProps {
	address: string;
}

const ShowDepositAddress = ({
	address,
}: ShowDepositAddressProps): JSX.Element => {
	return (
		<>
			<Heading
				fontWeight='500'
				fontSize={{ base: '22', md: '24' }}
				color='#1A202C'
			>
				Bitcoin Deposit to Federation
			</Heading>

			<Text maxW='sm' py='3'>
				Please pay to the address address shown to deposit funds into this
				federation You can scan the QR code to pay.
			</Text>
			<Text py='1'></Text>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				alignItems={{ base: 'left', md: 'center' }}
				mb={4}
			>
				<Text fontSize='lg' fontWeight='500' color='#1A202C' mr={2}>
					Address:
				</Text>
				<Text fontSize='lg'>{truncateStringFormat(address)}</Text>
			</Flex>
		</>
	);
};

interface ShowTransactionProps {
	txid: string;
	address: string;
	amount_btc: number;
	confirmations: number;
	confirmationsRequired: number;
}

const ShowTransaction = (props: ShowTransactionProps) => {
	const { txid, address, amount_btc, confirmations, confirmationsRequired } =
		props;
	const progress = (100 * confirmations) / confirmationsRequired;

	return (
		<>
			<Heading
				fontWeight='500'
				fontSize={{ base: '22', md: '24' }}
				color='#1A202C'
			>
				Bitcoin Deposit
			</Heading>
			<Flex align='center' mt={3}>
				<Text fontSize='lg' mr={2}>
					Amount:
				</Text>
				<Text fontSize='lg' fontWeight='bold'>
					{amount_btc} BTC
				</Text>
			</Flex>
			<Flex alignItems='center' gap={1}>
				<Flex
					flexDir={{ base: 'column', md: 'row' }}
					alignItems={{ base: 'left', md: 'center' }}
					mt={4}
				>
					<Text fontSize='lg' fontWeight='500' color='#1A202C' mr={2}>
						Confirmations:
					</Text>
					<Text>
						{confirmations} / {confirmationsRequired} required
					</Text>
				</Flex>
				<Spacer />
				{progress < 100 ? (
					<Badge colorScheme='red' variant='outline' mb={-4}>
						Pending
					</Badge>
				) : (
					<Badge colorScheme='orange' variant='outline' mb={-4}>
						Complete
					</Badge>
				)}
			</Flex>
			<Progress
				value={progress}
				size='xs'
				colorScheme='orange'
				hasStripe
				mb={2}
			/>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				alignItems={{ base: 'left', md: 'center' }}
				mb={4}
			>
				<Text fontSize='lg' fontWeight='500' color='#1A202C' mr={2}>
					Receiving Addr:
				</Text>
				<Text> {truncateStringFormat(address)}</Text>
			</Flex>
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				alignItems={{ base: 'left', md: 'center' }}
				mb={4}
			>
				<Text fontSize='lg' fontWeight='500' color='#1A202C' mr={2}>
					Transaction ID:
				</Text>
				<Text> {truncateStringFormat(txid)}</Text>
			</Flex>
		</>
	);
};
