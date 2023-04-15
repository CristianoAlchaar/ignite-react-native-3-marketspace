import { useCallback, useState } from 'react'
import { HStack, Pressable, Text, theme, useToast, VStack } from 'native-base'

import { ArrowLeft, WhatsappLogo } from 'phosphor-react-native'

import { api } from '@services/api'
import { ProductDTO, ProductsImageDTO } from '@dtos/productDTO'
import { AppError } from '@utils/AppError'

import { adDetailsParams } from 'src/@types/adRouteParams'

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { LargeAdvertise } from '@components/LargeAdvertise'
import { ButtonToken } from '@components/ButtonToken'
import { Loading } from '@components/Loading'
import { Linking } from 'react-native'

export function AdDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)

  const route = useRoute()
  const navigation = useNavigation()

  const { productId } = route.params as adDetailsParams

  const toast = useToast()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleCall() {
    await Linking.openURL(`https://wa.me/${product.user.tel}`)
  }

  async function fetchProduct() {
    try {
      setIsLoading(true)

      const response = await api.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o anúncio. '

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProduct()
    }, [productId]),
  )

  return (
    <VStack flex={1} bgColor={'gray.200'}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <HStack pl={'24px'} mt={'64px'} mb={'12px'}>
            <Pressable onPress={handleGoBack}>
              <ArrowLeft size={'24px'} color={theme.colors.gray[700]} />
            </Pressable>
          </HStack>

          <LargeAdvertise
            productImgs={product.product_images.map(
              (image: ProductsImageDTO) => {
                const fileName = image.path.split('/').pop() || ''
                const extension = fileName.split('.').pop() || ''
                const mimeType = `image/${extension.toLowerCase()}`

                return {
                  name: image.id,
                  uri: `${api.defaults.baseURL}/images/${image.path}`,
                  type: mimeType,
                  isNew: false,
                }
              },
            )}
            acceptTrade={product.accept_trade}
            condition={product.is_new === true ? 'new' : 'used'}
            description={product.description}
            paymentMethods={product.payment_methods.map((method) => method.key)}
            price={product.price / 100}
            title={product.name}
            anouncer={product.user}
          />
          <HStack
            px={'24px'}
            py={'20px'}
            height={'90px'}
            bgColor={'gray.100'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <HStack alignItems={'baseline'}>
              <Text fontSize={'md'} color={'blue.500'} fontFamily={'heading'}>
                R$
              </Text>
              <Text fontSize={'xl'} color={'blue.500'} fontFamily={'heading'}>
                {(product.price / 100).toFixed(2)}
              </Text>
            </HStack>

            <ButtonToken
              message="Entrar em contato"
              variant="BLUE"
              onPress={handleCall}
              leftElement={
                <WhatsappLogo
                  weight="fill"
                  color={theme.colors.gray[200]}
                  size={'16px'}
                />
              }
            />
          </HStack>
        </>
      )}
    </VStack>
  )
}
