import { forwardRef } from "react";
import { Text, Box, Stack, Radio, RadioGroup } from "@chakra-ui/react";

const Notification = forwardRef((props, ref) => {
  const { notification, boxProps } = props;

  return (
    <Box {...boxProps}>
      <Text fontSize="lg" pb="2px">通知</Text>
      <RadioGroup>
        <Stack direction={["column", "row"]} justify="space-around" mx="auto" w="112px">
          <Radio value="on" defaultChecked={notification} ref={ref}>ON</Radio>
          <Radio value="off" defaultChecked={!notification}>OFF</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
});

export default Notification;
