import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import {
  HStack,
  VStack,
  Text,
  Pressable,
  Select,
  FlatList,
  useToast,
  useTheme,
} from 'native-base'

import { Plus, CaretDown } from 'phosphor-react-native'

import { SmallAdvertise } from '@components/SmallAdvertise'
import { api } from '@services/api'

import { PhotoType } from 'src/@types/photoType'
import { ProductDTO, ProductsImageDTO } from '@dtos/productDTO'

import { Loading } from '@components/Loading'
import { AppError } from '@utils/AppError'

type productType = 'ALL' | 'ACTIVE' | 'DISABLED'

export function UserAds() {
  const [productType, setProductType] = useState<productType>('ACTIVE')
  const [filteredAds, setFilteredAds] = useState<ProductDTO[]>([])
  const [userProducts, setUserProducts] = useState<ProductDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  const { colors } = useTheme()

  function handleAddNewAd() {
    navigation.navigate('createAd')
  }

  function handleFilteredAds(value: productType) {
    if (value === 'ACTIVE') {
      const activeFilteredAds = userProducts.filter(
        (product) => product.is_active === true,
      )
      setFilteredAds(activeFilteredAds)
    }

    if (value === 'DISABLED') {
      const inactiveFilteredAds = userProducts.filter(
        (product) => product.is_active === false,
      )
      setFilteredAds(inactiveFilteredAds)
    }

    if (value === 'ALL') {
      setFilteredAds(userProducts)
    }
  }

  function handleAdClick(item: ProductDTO) {
    const payMethods: string[] = item.payment_methods.map(
      (method) => method.key,
    )

    const productImgs: PhotoType[] = item.product_images.map(
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
    )

    navigation.navigate('userAdDetails', {
      productImgs,
      productId: item.id,
      title: item.name,
      description: item.description,
      condition: item.is_new ? 'new' : 'used',
      acceptTrade: item.accept_trade,
      paymentMethods: payMethods,
      price: item.price / 100,
      isActive: item.is_active,
    })
  }

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const response = await api.get('/users/products')

      setUserProducts(response.data.reverse())
      setFilteredAds(response.data.reverse())
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregas os dados. Tente novamente depois.'

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
      fetchProducts()
    }, []),
  )

  useEffect(() => {
    productType !== undefined && handleFilteredAds(productType)
  }, [productType])

  return (
    <VStack flex={1} pt={'64px'} bgColor={'gray.200'} paddingX={'24px'}>
      <HStack alignItems={'center'}>
        <Text
          fontFamily={'heading'}
          flex={1}
          fontSize={'lg'}
          color={'gray.700'}
          textAlign="center"
        >
          Meus Anúncios
        </Text>
        <Pressable onPress={handleAddNewAd}>
          <Plus size={'24px'} />
        </Pressable>
      </HStack>

      <HStack
        mt={'32px'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Text fontSize={'md'}>
          {filteredAds.length === 1
            ? `${filteredAds.length} anúncio`
            : `${filteredAds.length} anúncios`}
        </Text>
        <Select
          selectedValue={productType}
          width="130"
          accessibilityLabel="Todos"
          placeholder="Todos"
          dropdownIcon={
            <CaretDown
              size={'24px'}
              color={colors.gray[500]}
              style={{ marginRight: 8 }}
            />
          }
          mt={1}
          onValueChange={(itemValue) =>
            setProductType(itemValue as productType)
          }
          fontSize="sm"
          borderRadius={'6px'}
        >
          <Select.Item label="Todos" value="ALL" />
          <Select.Item label="Ativos" value="ACTIVE" />
          <Select.Item label="Inativos" value="DISABLED" />
        </Select>
      </HStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          mt={'24px'}
          data={filteredAds}
          keyExtractor={(product) => product.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <Pressable
              mb={'24px'}
              mr={'20px'}
              onPress={() => handleAdClick(item)}
            >
              <SmallAdvertise
                condition={item.is_new === true ? 'NEW' : 'USED'}
                imgUrl={item.product_images[0].path}
                price={(item.price / 100).toFixed(2).toString()}
                title={item.name}
                isDisabled={!item.is_active}
              />
            </Pressable>
          )}
        />
      )}
    </VStack>
  )
}
