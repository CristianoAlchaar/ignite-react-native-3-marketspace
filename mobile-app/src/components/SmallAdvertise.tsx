import { HStack, Image, Text, View, VStack } from 'native-base'

import { ProductTag } from './ProductTag'
import { api } from '@services/api'

interface SmallAdvertiseProps {
  condition: 'USED' | 'NEW'
  title: string
  price: string
  imgUrl: string
  isDisabled?: boolean
}

export function SmallAdvertise({
  condition,
  price,
  title,
  imgUrl,
  isDisabled = false,
}: SmallAdvertiseProps) {
  return (
    <VStack width={'153.5px'}>
      <View
        bgColor={isDisabled ? 'rgba(0,0,0,0.6)' : ''}
        zIndex={2}
        borderRadius={'6px'}
      >
        {isDisabled && (
          <Text
            color="#FFF"
            fontFamily={'heading'}
            position={'absolute'}
            left={'4px'}
            bottom={'8px'}
            zIndex={3}
            fontSize={'sm'}
          >
            DESATIVADO
          </Text>
        )}
        <View opacity={isDisabled ? 0.5 : 1}>
          <ProductTag
            condition={condition}
            position={'absolute'}
            top={'4px'}
            right={'4px'}
            zIndex={1}
          />
          <Image
            height={'100px'}
            width={'153.5px'}
            source={{
              uri: `${api.defaults.baseURL}/images/${imgUrl}`,
            }}
            alt="Product"
            borderRadius={'6px'}
          />
        </View>
      </View>
      <Text
        color={isDisabled ? 'gray.400' : 'gray.600'}
        fontSize="md"
        ml={'4px'}
      >
        {title}
      </Text>
      <HStack style={{ alignItems: 'baseline' }} ml={'4px'}>
        <Text
          mr={'3px'}
          fontFamily={'heading'}
          fontSize="xs"
          color={isDisabled ? 'gray.400' : 'gray.600'}
        >
          R$
        </Text>
        <Text
          fontFamily={'heading'}
          fontSize="lg"
          color={isDisabled ? 'gray.400' : 'gray.600'}
        >
          {price}
        </Text>
      </HStack>
    </VStack>
  )
}
