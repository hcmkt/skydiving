import type { FC } from 'react';
import { Box, Text, Radio, RadioGroup, Wrap } from '@chakra-ui/react';
import type {
  SpaceProps,
  LayoutProps,
  RadioGroupProps,
} from '@chakra-ui/react';

type Props = {
  title: string;
  options: string[];
  radioGroupProps?: Omit<RadioGroupProps, 'children'>;
  maxW?: LayoutProps['maxW'];
  mb?: SpaceProps['mb'];
};

const RadioUnit: FC<Props> = ({
  title,
  options,
  radioGroupProps = undefined,
  maxW = '100%',
  mb = 0,
}) => (
  <Box mb={mb}>
    <Text fontSize="lg">{title}</Text>
    <RadioGroup {...radioGroupProps}>
      <Box mx="auto" maxW={maxW}>
        <Wrap justify="space-around">
          {options.map((option, i) => (
            <Radio value={option} key={i}>
              {option}
            </Radio>
          ))}
        </Wrap>
      </Box>
    </RadioGroup>
  </Box>
);

export default RadioUnit;
