import type { FC } from 'react';
import { Box, Text, Input } from '@chakra-ui/react';
import type { SpaceProps } from '@chakra-ui/react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  title: string;
  registerReturn?: UseFormRegisterReturn;
  mb?: SpaceProps['mb'];
};

const NumberUnit: FC<Props> = ({
  title,
  registerReturn = undefined,
  mb = 0,
}) => (
  <Box mb={mb}>
    <Text fontSize="lg">{title}</Text>
    <Input type="number" {...registerReturn} textAlign="center" w={50} />
  </Box>
);

export default NumberUnit;
