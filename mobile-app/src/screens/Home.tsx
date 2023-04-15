import { useCallback, useState } from 'react'

import {
  Box,
  View,
  Text,
  Input,
  Button,
  theme,
  HStack,
  FlatList,
  Pressable,
  useToast,
} from 'native-base'

import { api } from '@services/api'

import { ProductDTO } from '@dtos/productDTO'
import { AppError } from '@utils/AppError'

import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { MagnifyingGlass, Sliders } from 'phosphor-react-native'

import { UserAdvertisementPanel } from '@components/UserAdvertisementPanel'

import { HomeHeader } from '@components/HomeHeader'
import { SmallAdvertise } from '@components/SmallAdvertise'

import { FilterModal } from '@components/FilterModal'
import { Loading } from '@components/Loading'

export function Home() {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [filter, setFilter] = useState({})
  const [query, setQuery] = useState('')
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  async function handleSearch() {
    try {
      const response = await api.get('/products', {
        params: { query },
      })

      setProducts(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os anúncios. '

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  function handleFilter() {
    showModal === true ? setShowModal(false) : setShowModal(true)
  }

  function handleItemClick(item: ProductDTO) {
    navigation.navigate('adDetails', { productId: item.id })
  }

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const response = await api.get('/products', {
        params: { ...filter },
      })

      setProducts(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os anúncios. Tente novamente mais tarde.'

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
    }, [filter]),
  )

  return (
    <View
      pt={'64px'}
      style={{ flex: 1 }}
      paddingX={'24px'}
      bgColor={'gray.200'}
    >
      <FilterModal
        isShown={showModal}
        toggleModal={handleFilter}
        setFilter={setFilter}
      />
      <HomeHeader />

      <Box mt={'33.5px'} mb={'32px'}>
        <Text color={'gray.500'} mb={'12px'}>
          Seus produtos anunciados para venda
        </Text>

        <UserAdvertisementPanel />
      </Box>
      <Text color={'gray.500'} mb={'12px'}>
        Compre produtos variados
      </Text>
      <Input
        placeholder="Buscar anúncio"
        keyboardType="default"
        autoCapitalize="none"
        bgColor={'gray.100'}
        borderRadius="6px"
        paddingX={'12px'}
        paddingY={'16px'}
        fontSize={'md'}
        onChangeText={(query) => setQuery(query)}
        InputRightElement={
          <HStack alignItems={'center'}>
            <Button bgColor={'gray.100'} onPress={handleSearch}>
              <MagnifyingGlass
                style={{ width: '20px', height: '20px' }}
                color={theme.colors.gray[500]}
              />
            </Button>
            <View w={'1px'} h={'30px'} bgColor={'gray.400'} />
            <Button bgColor={'gray.100'} onPress={handleFilter}>
              <Sliders
                style={{ width: '20px', height: '20px' }}
                color={theme.colors.gray[500]}
              />
            </Button>
          </HStack>
        }
      />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          mt={'24px'}
          data={products}
          keyExtractor={(product) => product.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <Pressable
              mb={'24px'}
              mr={'20px'}
              onPress={() => handleItemClick(item)}
            >
              <SmallAdvertise
                condition={item.is_new === true ? 'NEW' : 'USED'}
                imgUrl={item.product_images[0].path}
                price={(item.price / 100).toFixed(2).toString()}
                title={item.name}
              />
            </Pressable>
          )}
        />
      )}
    </View>
  )
}
