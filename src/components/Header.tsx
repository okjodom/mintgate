import React from 'react';
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Flex,
	Spacer,
} from '@chakra-ui/react';
import { Button as ChakraButton } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { Federation, Filter, Sort } from '../federation.types';
import { Button, ConnectLightningButton } from '.';

export type HeaderProps = {
	data: Federation[];
	isLnConnected: boolean;
	toggleShowConnectLn: () => void;
	toggleShowConnectFed: () => void;
	filterCallback: (filter: Filter) => void;
	sortCallback: (sort: Sort) => void;
};

export const Header = React.memo(function Header(
	props: HeaderProps
): JSX.Element {
	return (
		<Flex>
			<Flex alignItems='center' gap={2}>
				<ConnectLightningButton
					onClick={props.toggleShowConnectLn}
					isLnConnected={props.isLnConnected}
				/>
				<Button
					label='Connect Federation'
					onClick={props.toggleShowConnectFed}
					disabled={!props.isLnConnected}
				/>
			</Flex>
			<Spacer />
			<Flex alignItems='center' gap='2'>
				{/* sort menu button */}
				<Menu>
					<MenuButton as={ChakraButton} rightIcon={<FiChevronDown />}>
						Sort
					</MenuButton>
					<MenuList>
						<MenuItem onClick={() => props.sortCallback(Sort.Ascending)}>
							Ascending
						</MenuItem>
						<MenuItem onClick={() => props.sortCallback(Sort.Descending)}>
							Descending
						</MenuItem>
						<MenuItem onClick={() => props.sortCallback(Sort.Date)}>
							Date Created
						</MenuItem>
					</MenuList>
				</Menu>
				{/* filter menu button */}
				<Menu>
					<MenuButton as={ChakraButton} rightIcon={<FiChevronDown />}>
						Filter
					</MenuButton>
					<MenuList>
						<MenuItem onClick={() => props.filterCallback(true)}>
							Active
						</MenuItem>
						<MenuItem onClick={() => props.filterCallback(false)}>
							Archived
						</MenuItem>
						<MenuItem onClick={() => props.filterCallback(undefined)}>
							All
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		</Flex>
	);
});
