import React from 'react';
import { Button as CustomButton, } from '@chakra-ui/react';

export type ButtonProps = {
    onClick: () => void;
    children?: React.ReactNode;
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

type ExtendedButtonProps = ButtonProps & {
    label?: string;
}

export const Button = (button: ExtendedButtonProps) => {
    let content = button.label || button.children || 'Button';

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
            {content}
        </CustomButton>
    );
};

export type IconButtonProps = ButtonProps & {
    outlineColor?: string;
}

export const IconButton = (props: IconButtonProps) => {
    return (
        <CustomButton
            onClick={props.onClick}
            backgroundColor='transparent'
            outlineColor={props.outlineColor}
            color={props.color}
            fontSize={props.fontSize}
            size={props.size || 'md'}
            rightIcon={props.icon}
            height={props.height}
            width={props.width}
            borderRadius={props.borderRadius || 100}
            isLoading={props.isLoading}
            disabled={props.disabled}
            p={0}
            m={1}
        >
            {props.children || 'Icon'}
        </CustomButton>
    );
};
