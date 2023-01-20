import React from 'react';
import { Button as CustomButton, ResponsiveObject } from '@chakra-ui/react';

export type ButtonProps = {
	label: string;
	onClick: () => void;
	icon?: React.ReactSVGElement;
	size?: string;
	fontSize?: ResponsiveObject<string>;
	height?: string | number;
	width?: string | number;
	borderRadius?: string | number;
	isLoading?: boolean;
	disabled?: boolean;
	children?: React.ReactNode;
	p?: ResponsiveObject<string>;
};

export const Button = (props: ButtonProps) => {
	return (
		<CustomButton backgroundColor='black' color='white' {...props}>
			{props.label || props.children}
		</CustomButton>
	);
};
