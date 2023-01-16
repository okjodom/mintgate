import { Button as CustomButton } from '@chakra-ui/react';

export type ButtonProps = {
	label: string;
	onClick: () => void;
	color?: string;
	icon?: any;
	size?: string;
	fontSize?: string | number;
	height?: string | number;
	width?: string | number;
	borderRadius?: string | number;
	isLoading?: boolean;
	disabled?: boolean;
};

export const Button = (button: ButtonProps) => {
	return (
		<CustomButton
			onClick={button.onClick}
			backgroundColor='black'
			color={button.color || 'white'}
			fontSize={button.fontSize}
			size={button.size}
			rightIcon={button.icon}
			height={button.height}
			width={button.width}
			borderRadius={button.borderRadius}
			isLoading={button.isLoading}
			disabled={button.disabled}
		>
			{button.label}
		</CustomButton>
	);
};
