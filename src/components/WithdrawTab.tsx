
import React from 'react';
import { TabPanel, Stack, Box } from '@chakra-ui/react'
import { TriangleDownIcon } from '@chakra-ui/icons';
import { Input, TabHeader, Button, IconButton, IconButtonProps } from '.';

export const WithdrawTabHeader = (): JSX.Element => {
    return (
        <TabHeader>
            <Box as='span' mr='2'>
                <TriangleDownIcon />
            </Box>
            Withdraw
        </TabHeader>
    )
}

interface WithdrawTabProps {
    balance_btc: number;
}


export const WithdrawTab = React.memo((props: WithdrawTabProps): JSX.Element => {
    let { balance_btc } = props;

    return <TabPanel>
        <Stack spacing='4' maxWidth='md'>
            <p>
                <span>Current Balance: </span>
                {balance_btc} BTC
            </p>
            <Input
                labelName=' Amount:'
                placeHolder='Enter amount'
                value=''
                onChange={() => { }}
            />
            <Input
                labelName='BTC address:'
                placeHolder='Your bitcoin wallet address '
                value=''
                onChange={() => { }}
            />

            <Button label='Withdraw' borderRadius='4' onClick={() => console.log('withdraw')} />
        </Stack>
    </TabPanel>
});

type WithdrawTabIconButtonProps = IconButtonProps &  {
    onClick: () => void;
}

export const WithdrawTabIconButton = (props: WithdrawTabIconButtonProps): JSX.Element => {
    return (
        <IconButton onClick={props.onClick} aria-label={''}><TriangleDownIcon /></IconButton>
    )
}
