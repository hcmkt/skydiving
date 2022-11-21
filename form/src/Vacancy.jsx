import { forwardRef } from "react";
import { Text, Box, Input } from "@chakra-ui/react";

const Vacancy = forwardRef((props, ref) => {
  const { vacancy, boxProps } = props;

  return (
    <Box {...boxProps}>
      <Text fontSize="lg" pb="2px">最低枠数</Text>
      <Input
        type="number"
        w="52px"
        textAlign="center"
        ref={ref}
        defaultValue={vacancy}
      />
    </Box>
  );
});

export default Vacancy;
