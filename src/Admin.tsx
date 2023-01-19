import React, { useState } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import {
	Header,
	FederationCard,
	ConnectFederation,
	ConnectLightning,
} from './components';
import { Federation, Filter, Sort } from './federation.types';
import { data } from './federation.data';

export const Admin = React.memo(function Admin(): JSX.Element {
	const [fedlist, setFedlist] = useState<Federation[]>(data.federations);
	const [isLnConnected, updateIsLnConnected] = useState<boolean>(false);

	const [showConnectLn, toggleShowConnectLn] = useState<boolean>(true);
	const [showConnectFed, toggleShowConnectFed] = useState<boolean>(false);

	const filterFederations = (filter: Filter) => {
		const federations =
			filter === undefined
				? data.federations
				: data.federations.filter(
					(federation: Federation) => federation.details.active === filter
					// eslint-disable-next-line no-mixed-spaces-and-tabs
				  );
		setFedlist(federations);
	};

	const sortFederations = (sort: Sort) => {
		const fedListCopy = [...fedlist];

		switch (sort) {
		case Sort.Ascending: {
			const result = fedListCopy.sort((a, b) =>
				a.details.name < b.details.name
					? -1
					: a.details.name > b.details.name
						? 1
						: 0
			);

			return setFedlist(result);
		}

		case Sort.Descending: {
			const result = fedListCopy.sort((a, b) =>
				a.details.name < b.details.name
					? 1
					: a.details.name > b.details.name
						? -1
						: 0
			);

			return setFedlist(result);
		}

		case Sort.Date: {
			const result = fedListCopy.sort((a, b) =>
				a.details.date_created < b.details.date_created
					? 1
					: a.details.date_created > b.details.date_created
						? -1
						: 0
			);

			return setFedlist(result);
		}

		default: {
			return setFedlist(data.federations);
		}
		}
	};

	// TODO: Make real api call to connect gateway to proposed lightning rpc service
	const proposeGatewayLightningService = async (url: URL) => {
		console.log(url);
		updateIsLnConnected(true);
		toggleShowConnectLn(false);
	};

	return (
		<Box mt={10} mb={10} mr={[2, 4, 6, 10]} ml={[2, 4, 6, 10]}>
			<Header
				data={data.federations}
				isLnConnected={isLnConnected}
				toggleShowConnectLn={() => toggleShowConnectLn(!showConnectLn)}
				toggleShowConnectFed={() => toggleShowConnectFed(!showConnectFed)}
				filterCallback={filterFederations}
				sortCallback={sortFederations}
			/>
			<ConnectLightning
				isOpen={showConnectLn}
				isLnConnected={isLnConnected}
				proposeGatewayLightningService={proposeGatewayLightningService}
			/>
			<ConnectFederation isOpen={showConnectFed} />
			<Stack spacing={6} pt={6}>
				{fedlist.map((federation: Federation) => {
					return (
						<FederationCard
							key={federation.mint_pubkey}
							federation={federation}
							onClick={() => console.log('clicked')}
						/>
					);
				})}
			</Stack>
		</Box>
	);
});
