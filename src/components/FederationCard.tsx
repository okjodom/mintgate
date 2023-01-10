import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, IconButton } from '@chakra-ui/react'
import { Federation } from '../federation.types';
import { InfoTab, InfoTabHeader, InfoTabIconButton, DepositTab, DepositTabHeader } from '.';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

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
                    <section>
                        <InfoTabIconButton onClick={() => setVisibleTab(DetailsView.InfoTab)} />
                        <IconButton onClick={() => { visibleTab > -1 ? setVisibleTab(DetailsView.Off) : setVisibleTab(DetailsView.InfoTab); }} aria-label={''}>
                            {visibleTab >= 0 ? <ViewOffIcon /> : <ViewIcon />}
                        </IconButton>
                    </section>
                </div>
                {visibleTab >= 0 && <Tabs>
                    <TabList>
                        <InfoTabHeader />
                        <DepositTabHeader />
                    </TabList>

                    <TabPanels>
                        <InfoTab {...details} />
                        <DepositTab {...details} />
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
