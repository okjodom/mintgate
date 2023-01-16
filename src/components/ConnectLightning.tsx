import React, { useState } from "react";
import { Box, Collapse, HStack } from "@chakra-ui/react";
import { isWebUri } from "valid-url";
import { Button, Input } from ".";

export type ConnectLightningButtonProps = {
  onClick: () => void;
};

export const ConnectLightningButton = (props: ConnectLightningButtonProps) => {
  return <Button label="Connect Lightning" onClick={props.onClick} />;
};

export type ConnectLightningProps = {
  isOpen: boolean;
};

interface LnrpcURL {
  value: string;
  isValid: boolean;
}

export const ConnectLightning = (props: ConnectLightningProps) => {
  const [url, updateUrl] = useState<LnrpcURL>({ value: "", isValid: false });

  const handleInputString = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { value } = event.target;
    let validatedValue = isWebUri(value);
    if (validatedValue === undefined) {
      updateUrl({ value, isValid: false });
    } else {
      updateUrl({ value: validatedValue, isValid: true });
    }
  };

  return (
    <Collapse in={props.isOpen} animateOpacity>
      <Box m="1">
        <HStack
          borderRadius="4"
          p="8"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          mt="8"
          mb="4"
          spacing="4"
          alignItems="flex-end"
        >
          <Input
            labelName="Connect Lightning:"
            placeHolder="Enter url to Gateway lightning service"
            value={url.value}
            onChange={(event) => handleInputString(event)}
          />
          <Button
            label="Connect 🚀"
            borderRadius="4"
            onClick={() => console.log("clicked")}
            height="48px"
            disabled={!url.isValid}
          />
        </HStack>
      </Box>
    </Collapse>
  );
};
