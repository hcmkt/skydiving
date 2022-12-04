import { forwardRef } from "react";
import { Heading, Checkbox, Stack, Box } from "@chakra-ui/react";

const MultipleChoice = forwardRef((props, ref) => {
  const { title, options, defaults, stackProps, boxProps, flag = false } = props;

  return (
    <Box {...boxProps}>
      <Heading as="h3" fontSize="lg" pb="2px">{title}</Heading>
        <Stack
          direction={["row, column"]}
          justify="space-around"
          mx="auto"
          {...stackProps}
        >
          {options.map((option, i) => (
            <Checkbox
              key={`${i}_${defaults === undefined ? 'a' : 'b'}`}
              ref={ref.current[i]}
              defaultChecked={defaults?.includes(option)}
              w={flag ? "25%" : ""}
            >
              {option}
            </Checkbox>
          ))}
        </Stack>
    </Box>
  );
});

export default MultipleChoice;
