import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Flex } from '@chakra-ui/react'
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { Federation } from '../federation.types';
import { IconButton, InfoTabHeader, InfoTabIconButton, InfoTab, WithdrawTabHeader, WithdrawTab, WithdrawTabIconButton } from '.';

interface FederationProps {
    federation: Federation;
    onClick: () => void;
}

enum DetailsView {
    Off = -1,
    InfoTab = 0,
    WithdrawTab = 1,
}

export const FederationCard = (props: FederationProps): JSX.Element => {
    const { mint_pubkey, details } = props.federation;

    const [visibleTab, setVisibleTab] = useState<DetailsView>(DetailsView.Off);

    const getFederationName = (name: string): string => {
        return name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase();
    };

    return (
        <>
            <main style={cardMainWrapper}>
                <div style={cardMajorProps}>
                    <div style={cardMajorProps}>
                        <section style={nameWrapper}>
                            <h3 style={nameStyle}>{getFederationName(details.name)}</h3>
                        </section>
                        <section>
                            <p>{details.description}</p>
                            <p>{mint_pubkey}</p>
                        </section>
                    </div>
                    <Flex>
                        <InfoTabIconButton onClick={() => setVisibleTab(DetailsView.InfoTab)} />
                        {/* <WithdrawTabIconButton onClick={() => setVisibleTab(DetailsView.WithdrawTab)} /> */}
                        <IconButton onClick={() => { visibleTab > -1 ? setVisibleTab(DetailsView.Off) : setVisibleTab(DetailsView.InfoTab); }} aria-label={''}>
                            {visibleTab > -1 ? <ViewOffIcon /> : <ViewIcon />}
                        </IconButton>
                    </Flex>
                </div>
                {visibleTab >= 0 && <Tabs index={visibleTab} onChange={(visibleTab) => setVisibleTab(visibleTab)}>
                    <TabList>
                        <InfoTabHeader />
                        {/* <WithdrawTabHeader /> */}
                    </TabList>

                    <TabPanels>
                        <InfoTab {...details} />
                        {/* <WithdrawTab balance_btc={1} /> */}
                    </TabPanels>
                </Tabs>}
            </main>
        </>
    );
};

const cardMainWrapper = {
    boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
    padding: 16,
    borderRadius: 8,
};

const cardMajorProps = {
    display: 'flex',
    FlexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
};

const nameWrapper = {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: '50%',
};

const nameStyle = {
    color: 'white',
    margin: 0,
};
