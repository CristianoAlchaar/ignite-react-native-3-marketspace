import { Box, Image, Pressable, theme } from 'native-base'

import { XCircle } from 'phosphor-react-native'

interface ProductFrameProps {
  imgPath: string
  onRemove: () => void
}

export function ProductFrame({ imgPath, onRemove }: ProductFrameProps) {
  return (
    <Box
      borderRadius={'6px'}
      size={'100px'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Image
        source={{ uri: imgPath }}
        alt="Foto do produto"
        h={'100px'}
        w={'100px'}
        borderRadius={'6px'}
      />

      <Pressable
        onPress={onRemove}
        position="absolute"
        top={'4px'}
        right={'4px'}
      >
        <XCircle size={'24px'} weight="fill" color={theme.colors.gray[600]} />
      </Pressable>
    </Box>
  )
}
