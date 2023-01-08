import React, { useState } from 'react';
import { Header, FederationCard, ConnectFederation } from './components';
import { Federation, Filter, Sort } from './federation.types';
import { data } from './federation.data';
import { Box, Stack, useDisclosure } from '@chakra-ui/react';

export const Admin = React.memo(() => {
    const [fedlist, setFedlist] = useState<Federation[]>(data.federations);
    const { isOpen: showConnectFed, onToggle: toggleShowConnectFed } = useDisclosure();

    const filterFederations = (filter: Filter) => {
        let federations = filter === undefined ? data.federations : data.federations.filter((federation) => federation.details.active === filter);
        setFedlist(federations);
    };

    const sortFederations = (sort: Sort) => {
        const fedListCopy = [...fedlist];

        switch (sort) {
            case Sort.Ascending: {
                const result = fedListCopy.sort((a, b) => (a.details.name < b.details.name ? -1 : a.details.name > b.details.name ? 1 : 0));

                return setFedlist(result);
            }

            case Sort.Descending: {
                const result = fedListCopy.sort((a, b) => (a.details.name < b.details.name ? 1 : a.details.name > b.details.name ? -1 : 0));

                return setFedlist(result);
            }

            case Sort.Date: {
                const result = fedListCopy.sort((a, b) =>
                    a.details.date_created < b.details.date_created ? 1 : a.details.date_created > b.details.date_created ? -1 : 0
                );

                return setFedlist(result);
            }

            default: {
                return setFedlist(data.federations);
            }
        }
    };

    return (
        <Box m='10'>
            <Header
                toggleShowConnectFed={toggleShowConnectFed}
                data={data.federations}
                filterCallback={filterFederations}
                sortCallback={sortFederations}
            />
            <ConnectFederation isOpen={showConnectFed} />
            <Stack spacing={6} pt={6}>
                {fedlist.map((federation: Federation) => {
                    return <FederationCard key={federation.mint_pubkey} federation={federation} onClick={() => console.log('clicked')} />;
                })}
            </Stack>
        </Box>
    );
});
