import { Box, Pressable, theme } from 'native-base'

import { Plus } from 'phosphor-react-native'

interface EmptyFrameProps {
  handlePress: () => void
}

export function EmptyFrame({ handlePress }: EmptyFrameProps) {
  return (
    <Pressable onPress={handlePress}>
      <Box
        bgColor={'gray.300'}
        borderRadius={'6px'}
        size={'100px'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Plus size={'24px'} color={theme.colors.gray[400]} />
      </Box>
    </Pressable>
  )
}
