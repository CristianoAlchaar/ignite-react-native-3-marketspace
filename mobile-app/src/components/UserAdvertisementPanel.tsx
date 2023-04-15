import { useCallback, useState } from 'react'
import { ProductDTO } from '@dtos/productDTO'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { HStack, Pressable, Text, theme, VStack } from 'native-base'

import { Tag, ArrowRight } from 'phosphor-react-native'
import { api } from '@services/api'

export function UserAdvertisementPanel() {
  const [userProducts, setUserProducts] = useState<ProductDTO[]>([])
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleMyAdsTouchButton() {
    navigation.navigate('userAds')
  }

  async function fetchUserProduct() {
    try {
      const response = await api.get('users/products')
      setUserProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const userProductsActives = userProducts.filter(
    (product) => product.is_active === true,
  )

  useFocusEffect(
    useCallback(() => {
      fetchUserProduct()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProductsActives.length]),
  )
  return (
    <HStack
      padding={'12px 20px 12px 20px'}
      alignItems={'center'}
      borderRadius="6px"
      backgroundColor={'rgba(100, 122, 199, 0.1)'}
      justifyContent={'space-between'}
    >
      <HStack alignItems={'center'} style={{ gap: 8 }}>
        <Tag color={theme.colors.blue[500]} size={'22px'} />
        <VStack>
          <Text fontFamily={'heading'} fontSize={'lg'} color={'gray.600'}>
            {userProductsActives.length}
          </Text>
          <Text>
            {userProductsActives.length > 1
              ? 'anúncios ativos'
              : 'anúncio ativo'}
          </Text>
        </VStack>
      </HStack>
      <Pressable onPress={handleMyAdsTouchButton}>
        <HStack alignItems={'center'}>
          <Text mr={'10px'} color={'blue.500'}>
            Meus anúncios
          </Text>
          <ArrowRight color={theme.colors.blue[500]} size={'16px'} />
        </HStack>
      </Pressable>
    </HStack>
  )
}
