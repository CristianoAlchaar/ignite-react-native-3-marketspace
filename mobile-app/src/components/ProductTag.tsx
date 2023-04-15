import { Box, Text, IBoxProps } from 'native-base'

interface ProductTagProps extends IBoxProps {
  condition: 'USED' | 'NEW'
}

export function ProductTag({ condition, ...rest }: ProductTagProps) {
  return (
    <Box
      paddingY={'2px'}
      paddingX={'8px'}
      borderLeftRadius={'1000px'}
      borderRightRadius={'1000px'}
      backgroundColor={condition === 'NEW' ? 'blue.500' : 'gray.600'}
      w={'70px'}
      alignItems="center"
      {...rest}
    >
      <Text color="#FFF" fontFamily={'heading'} fontSize={'xs'}>
        {condition === 'NEW' ? 'NOVO' : 'USADO'}
      </Text>
    </Box>
  )
}
