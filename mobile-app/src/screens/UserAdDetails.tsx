import { useCallback, useState } from 'react'
import { Box, HStack, Pressable, theme, useToast, VStack } from 'native-base'

import { ArrowLeft, Trash, Power, Pencil } from 'phosphor-react-native'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { LargeAdvertise } from '@components/LargeAdvertise'
import { ButtonToken } from '@components/ButtonToken'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { userAdDetailsRouteParams } from 'src/@types/adRouteParams'

export function UserAdDetails() {
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    isActive,
  } = route?.params as userAdDetailsRouteParams

  const toast = useToast()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleEdit() {
    navigation.navigate('editAd', {
      productImgs,
      title,
      description,
      condition,
      acceptTrade,
      paymentMethods,
      price,
      productId,
    })
  }

  async function handleEnableAd() {
    try {
      setIsLoading(true)
      await api.patch(`/products/${productId}`, {
        is_active: true,
      })
      setIsDisabled(false)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível ativar o anúncio. '

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDisableAd() {
    try {
      setIsLoading(true)
      await api.patch(`/products/${productId}`, {
        is_active: false,
      })
      setIsDisabled(true)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível desativar o anúncio. '

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAd() {
    try {
      await api.delete(`products/${productId}`)

      toast.show({
        title: 'Anúncio Excluído',
        placement: 'top',
        bgColor: 'red.500',
      })

      navigation.navigate('userAds')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível excluir o anúncio. '

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      setIsDisabled(!isActive)

      return () => setIsDisabled(false)
    }, [isActive]),
  )

  return (
    <VStack flex={1} bgColor={'gray.200'}>
      <HStack
        px={'24px'}
        mt={'64px'}
        mb={'12px'}
        justifyContent={'space-between'}
      >
        <Pressable onPress={handleGoBack}>
          <ArrowLeft size={'24px'} color={theme.colors.gray[700]} />
        </Pressable>
        <Pressable onPress={handleEdit}>
          <Pencil size={'24px'} color={theme.colors.gray[700]} />
        </Pressable>
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
        isDisabled={isDisabled}
      />
      <Box px={'24px'} style={{ gap: 8 }} pb={4}>
        <ButtonToken
          isLoading={isLoading}
          message={isDisabled ? 'Reativar Anúncio ' : 'Desativar Anúncio'}
          variant={isDisabled ? 'BLUE' : 'BLACK'}
          onPress={isDisabled ? handleEnableAd : handleDisableAd}
          leftElement={<Power color={theme.colors.gray[200]} size={'16px'} />}
        />
        <ButtonToken
          message="Excluir Anúncio"
          variant="GRAY"
          onPress={handleDeleteAd}
          leftElement={<Trash color={theme.colors.gray[500]} size={'16px'} />}
        />
      </Box>
    </VStack>
  )
}
