import React from 'react';
import { Box, IconButton, TabPanel } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons';
import { TabHeader } from '.';

export const InfoTabHeader = (): JSX.Element => {
    return (
        <TabHeader>
            <Box as='span' mr='2'>
                <InfoIcon />
            </Box>
            Info
        </TabHeader>
    )
}

interface InfoTabProps {
    date_created: string;
    description: string;
}

export const InfoTab = React.memo((props: InfoTabProps): JSX.Element => {
    let { description, date_created } = props;
    return <TabPanel>
        <p>
            <span>Federation Description: </span>
            {description}
        </p>
        <section>
            <p>
                <span>Date Created: </span>
                {date_created}
            </p>
        </section>
    </TabPanel>
});

type InfoTabIconButtonProps = {
    onClick: () => void;
}

export const InfoTabIconButton = (props: InfoTabIconButtonProps): JSX.Element => {
    return (
        <IconButton onClick={props.onClick} aria-label={''}><InfoIcon /></IconButton>
    )
}
