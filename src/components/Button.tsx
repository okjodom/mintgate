import React from 'react';

export type ButtonProps = {
    label: string
    onClick: () => void
    color?: string
    icon?: any
}

export const Button = (button: ButtonProps) => {

    return (
        <button style={buttonStyles} onClick={button.onClick}>
            <div>
                {
                    button.icon
                        ? button.icon
                        : null
                }
            </div>
            {
                button.label
            }
        </button>
    )
}

const buttonStyles = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    border: "none",
    outline: "none",
    alignItems: "center",
    justifyContent: "center",
    whitespace: "nowrap",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as "uppercase",
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    fontFamily: 'Source Sans Pro',
    ":hover": {
        backgroundColor: "white",
        color: "black",
        border: "1px solid black",
    },
}

// .button-wrapper:hover {
//     background-color: white;
//     color: black;
//     border: 1px solid black;
// }
