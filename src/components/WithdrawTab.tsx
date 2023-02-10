import React, { useCallback, useState } from 'react';
import { Box, Stack, TabPanel, Text } from '@chakra-ui/react';
import { TabHeader, Button, Input, ApiContext } from '.';

export const WithdrawTabHeader = () => {
	return <TabHeader>Withdraw</TabHeader>;
};

interface WithdrawObject {
	amount: number;
	walletAddress: string;
}

export interface WithdrawTabProps {
	federationId: string;
}

export const WithdrawTab = React.memo(function WithdrawTab({
	federationId,
}: WithdrawTabProps): JSX.Element {
	const { mintgate } = React.useContext(ApiContext);
	const [withdrawObject, setWithdrawObject] = useState<WithdrawObject>({
		amount: 0,
		walletAddress: '',
	});
	const [error, setError] = useState<string>('');

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault();
			const { value, name } = event.target;

			setWithdrawObject((prevState) => ({ ...prevState, [name]: value }));
		},
		[withdrawObject]
	);

	const createWithdrawal = async () => {
		const { amount, walletAddress } = withdrawObject;

		try {
			const txId = await mintgate.requestWithdrawal(
				federationId,
				amount,
				walletAddress
			);
			console.log(txId);
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
					value={withdrawObject.walletAddress}
					onChange={(e) => handleInputChange(e)}
					name='walletAddress'
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
		</TabPanel>
	);
});
