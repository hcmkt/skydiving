import { forwardRef } from "react";
import { Heading, Box, Stack, Radio, RadioGroup } from "@chakra-ui/react";

const Notification = forwardRef((props, ref) => {
  const { notification, boxProps } = props;

  return (
    <Box {...boxProps}>
      <Heading as="h3" fontSize="lg" pb="2px">通知</Heading>
      <RadioGroup>
        <Stack direction="row" justify="space-around" mx="auto" w="120px">
          <Radio value="on" defaultChecked={notification} ref={ref}>ON</Radio>
          <Radio value="off" defaultChecked={!notification}>OFF</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
});

export default Notification;
