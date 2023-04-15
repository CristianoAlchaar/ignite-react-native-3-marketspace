import { useCallback, useState } from 'react'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { adRouteParams, previewRouteParams } from 'src/@types/adRouteParams'

import { HStack, Pressable, theme, VStack, Text } from 'native-base'

import { EditAdForm } from '@components/EditAdForm'

import { ArrowLeft } from 'phosphor-react-native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

export function EditAd() {
  const [productToEdit, setProductToEdit] = useState<adRouteParams>()
  const [prodId, setProdId] = useState<string>()
  const [imgsToRemove, setImgsToRemove] = useState<string[]>()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const route = useRoute()
  const {
    productId,
    productImgs,
    title,
    description,
    condition,
    acceptTrade,
    paymentMethods,
    price,
    imagesToBeRemoved,
  } = route?.params as previewRouteParams

  function handleGoBack() {
    navigation.navigate('home')
  }

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setProductToEdit({
        productImgs,
        title,
        description,
        condition,
        acceptTrade,
        paymentMethods,
        price,
      })
      setProdId(productId)
      setImgsToRemove(imagesToBeRemoved)
      return () => {
        // Do something when the screen is unfocused
        setProductToEdit(undefined)
        setProdId(undefined)
        setImgsToRemove(undefined)
      }
    }, [
      productImgs,
      title,
      description,
      condition,
      acceptTrade,
      paymentMethods,
      price,
      productId,
      imagesToBeRemoved,
    ]),
  )

  return (
    <VStack flex={1} bgColor={'gray.200'}>
      <VStack flex={1}>
        <HStack mt={'64px'} mb={'12px'} alignItems={'center'} px={'24px'}>
          <Pressable onPress={handleGoBack}>
            <ArrowLeft size={'24px'} color={theme.colors.gray[700]} />
          </Pressable>
          <Text
            textAlign="center"
            flex={1}
            fontFamily="heading"
            fontSize={'lg'}
          >
            Editar Anúncio
          </Text>
        </HStack>
        {productToEdit !== undefined && (
          <EditAdForm
            productToEdit={productToEdit}
            productId={prodId}
            imgsToBeRemoved={imgsToRemove}
          />
        )}
      </VStack>
    </VStack>
  )
}
