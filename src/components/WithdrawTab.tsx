
import React from 'react';
import { Tab, TabPanel, Stack } from '@chakra-ui/react'
import { Input, Button } from '.';

export const WithdrawTabHeader = (): JSX.Element => {
    return <Tab>Withdraw</Tab>
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
