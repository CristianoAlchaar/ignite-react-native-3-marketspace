import { useState } from 'react'
import { HStack, Text, theme, useToast, VStack } from 'native-base'

import { ArrowLeft, Tag } from 'phosphor-react-native'

import { previewRouteParams } from 'src/@types/adRouteParams'

import { useNavigation, useRoute } from '@react-navigation/native'
import { LargeAdvertise } from '@components/LargeAdvertise'
import { ButtonToken } from '@components/ButtonToken'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

export function PreviewAd() {
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  const route = useRoute()
  const {
    productImgs,
    title,
    description,
    condition,
    acceptTrade,
    paymentMethods,
    price,
    productId,
    imagesToBeRemoved,
  } = route?.params as previewRouteParams

  function handleGoBack() {
    navigation.navigate('editAd', {
      productId,
      productImgs,
      title,
      description,
      condition,
      acceptTrade,
      paymentMethods,
      price,
      imagesToBeRemoved,
    })
  }

  async function handlePublish() {
    try {
      setIsLoading(true)

      const { data } = await api.post('/products/', {
        name: title,
        description,
        // eslint-disable-next-line no-unneeded-ternary
        is_new: condition === 'new' ? true : false,
        price: price * 100,
        accept_trade: acceptTrade,
        payment_methods: paymentMethods,
      })

      if (data?.id) {
        const photosForm = new FormData()

        productImgs.forEach((photo) => {
          photosForm.append('images', photo as any)
        })

        photosForm.append('product_id', data.id)

        await api.post('/products/images/', photosForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      setIsLoading(false)

      toast.show({
        title: 'Anúncio criado com sucesso.',
        placement: 'top',
        bgColor: 'green.500',
      })

      navigation.navigate('userAds')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível enviar. Tente novamente.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeImagesFromDatabase(imagesToDelete: string[]) {
    try {
      if (productId !== undefined) {
        await api.delete('/products/images', {
          data: { productImagesIds: imagesToDelete },
        })
      }
    } catch (error) {
      throw new Error('Não foi possível remover as imagens do banco de dados.')
    }
  }

  async function handlePublishAdChanges() {
    try {
      setIsLoading(true)
      await api.put(`/products/${productId}`, {
        name: title,
        description,
        // eslint-disable-next-line no-unneeded-ternary
        is_new: condition === 'new' ? true : false,
        price: price * 100,
        accept_trade: acceptTrade,
        payment_methods: paymentMethods,
      })

      // check if there are images to remove
      if (imagesToBeRemoved !== undefined && imagesToBeRemoved.length > 0) {
        await removeImagesFromDatabase(imagesToBeRemoved)
      }

      // check if there are new images
      const newProductsImageToStore = productImgs.filter(
        (image) => image.isNew === true,
      )

      if (productId !== undefined && newProductsImageToStore.length > 0) {
        const photosForm = new FormData()

        newProductsImageToStore.forEach((photo) => {
          photosForm.append('images', photo as any)
        })

        photosForm.append('product_id', productId)

        await api.post('/products/images/', photosForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      toast.show({
        title: 'Alterações publicadas com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })

      setIsLoading(false)
      navigation.navigate('userAds')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível cadastrar as alterações.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor={'gray.200'}>
      <HStack pt={'64px'} pb={'16px'} backgroundColor={'blue.300'}>
        <VStack alignItems={'center'} width={'100%'}>
          <Text color={'gray.100'} fontSize={'md'} fontFamily="heading">
            Pré visualização do anúncio
          </Text>
          <Text color={'gray.100'} fontSize={'sm'}>
            É assim que seu produto vai aparecer!
          </Text>
        </VStack>
      </HStack>
      <LargeAdvertise
        isUserAd={true}
        productImgs={productImgs}
        title={title}
        description={description}
        condition={condition}
        acceptTrade={acceptTrade}
        price={price}
        paymentMethods={paymentMethods}
      />
      <HStack
        px={'24px'}
        py={'20px'}
        height={'90px'}
        bgColor={'gray.100'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <ButtonToken
          message="Voltar e editar"
          variant="GRAY"
          onPress={handleGoBack}
          leftElement={
            <ArrowLeft color={theme.colors.gray[600]} size={'16px'} />
          }
          w={'157.5px'}
        />

        <ButtonToken
          message={productId !== undefined ? 'Publicar Alterações' : 'Publicar'}
          variant="BLUE"
          onPress={
            productId !== undefined ? handlePublishAdChanges : handlePublish
          }
          w={'157.5px'}
          leftElement={<Tag color={theme.colors.gray[200]} size={'16px'} />}
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  )
}
