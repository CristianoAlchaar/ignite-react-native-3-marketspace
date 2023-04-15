import { Box, Text, IBoxProps, HStack } from 'native-base'
import { Pressable } from 'react-native'

import { XCircle } from 'phosphor-react-native'

interface ConditionTagForModalProps extends IBoxProps {
  title: 'USED' | 'NEW'
  isSelected: boolean
  onPress: () => void
}

export function ConditionTagForModal({
  title,
  isSelected,
  onPress,
  ...rest
}: ConditionTagForModalProps) {
  return (
    <Pressable onPress={onPress}>
      <Box
        paddingX={'6px'}
        borderLeftRadius={'1000px'}
        borderRightRadius={'1000px'}
        backgroundColor={isSelected === true ? 'blue.300' : 'gray.300'}
        w={'90px'}
        alignItems="center"
        {...rest}
      >
        <HStack style={{ gap: 5 }} alignItems={'center'} height={'35px'}>
          <Text
            color={isSelected === true ? '#FFF' : 'gray.500'}
            fontFamily={'heading'}
            fontSize={'xs'}
            flex={1}
            textAlign="center"
          >
            {title === 'NEW' ? 'NOVO' : 'USADO'}
          </Text>

          {isSelected === true && <XCircle weight={'fill'} color={'#FFF'} />}
        </HStack>
      </Box>
    </Pressable>
  )
}
