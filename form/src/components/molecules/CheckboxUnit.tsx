import type { FC } from 'react';
import { Text, Checkbox, CheckboxGroup, Box, Wrap } from '@chakra-ui/react';
import type {
  CheckboxGroupProps,
  SpaceProps,
  LayoutProps,
} from '@chakra-ui/react';

type Props = {
  title: string;
  options: string[];
  checkboxGroupProps?: CheckboxGroupProps;
  maxW?: LayoutProps['maxW'];
  mb?: SpaceProps['mb'];
};

const CheckboxUnit: FC<Props> = ({
  title,
  options,
  checkboxGroupProps = undefined,
  maxW = '100%',
  mb = 0,
}) => (
  <Box mb={mb}>
    <Text fontSize="lg">{title}</Text>
    <CheckboxGroup {...checkboxGroupProps}>
      <Box mx="auto" maxW={maxW}>
        <Wrap justify="space-around">
          {options.map((option, i) => (
            <Checkbox value={option} key={i}>
              {option}
            </Checkbox>
          ))}
        </Wrap>
      </Box>
    </CheckboxGroup>
  </Box>
);

export default CheckboxUnit;
