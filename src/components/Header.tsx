import React from 'react';
import { Button } from './Button';

export const Header = (): JSX.Element => {
    const handleNewFederation = () => {
        console.log("new federation added");
    }

    return (
        <header style={headerStyles}>
            <Button
                label='Connect Federation'
                onClick={handleNewFederation}
            />
        </header>
    )
}

const headerStyles = {
    display: "flex",
    FlexDirection: "row",
    justifyContent: "spaceBetween",
    alignItems: "center",
    marginBottom: "24"
}
