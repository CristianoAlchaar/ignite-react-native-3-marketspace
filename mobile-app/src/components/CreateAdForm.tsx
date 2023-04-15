import React, { useState } from 'react'

import { Alert } from 'react-native'

import { useNavigation, useFocusEffect } from '@react-navigation/native'

import {
  Box,
  FormControl,
  HStack,
  Input,
  Radio,
  ScrollView,
  Switch,
  Text,
  TextArea,
  VStack,
  useToast,
} from 'native-base'

import { EmptyFrame } from './EmptyFrame'
import { PaymentMethods } from './PaymentMethods'
import { ProductFrame } from './ProductFrame'
import { ButtonToken } from './ButtonToken'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { PhotoType } from 'src/@types/photoType'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

const newProductSchema = yup.object({
  title: yup.string().required('Insira um título'),
  description: yup.string().required('Coloque uma descrição'),
  condition: yup.string().required('Escolha se o produto é novo ou usado'),
  price: yup.number().required('Preencha o valor do produto'),
  accept_trade: yup.boolean(),
  payment_methods: yup
    .array(yup.string().defined())
    .min(1, 'Preencha ao menos um método de pagamento')
    .required('Escolha um ou mais métodos de pagamento'),
})

type NewProductFormProps = yup.InferType<typeof newProductSchema>

export function CreateAdForm() {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)

  const [adPhotos, setAdPhotos] = useState<PhotoType[]>([])
  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const defaultValues = {
    title: '',
    description: '',
    condition: 'new',
    accept_trade: false,
    price: undefined,
    payment_methods: [],
  }

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProductFormProps>({
    resolver: yupResolver(newProductSchema),
    defaultValues,
  })

  function handleCancel() {
    Alert.alert(
      'Confirmar Cancelamento',
      'Você tem certeza que deseja cancelar? Esta ação irá descartar o anúncio.',
      [
        {
          text: 'Voltar ao anúncio',
          style: 'cancel',
        },
        {
          text: 'Sim, descartar anúncio',
          onPress: () => {
            navigation.navigate('home')
          },
        },
      ],
      { cancelable: false },
    )
  }

  async function handleProductPhotoSelection() {
    try {
      setIsPhotoLoading(true)
      const photosSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photosSelected.canceled) return

      photosSelected.assets.forEach(async (photo) => {
        if (photo.uri) {
          // photoInfo is type FileSyste.FileInfo however i was getting a type error
          // saying that size is not a property in type FileInfo, but size exists im sure of it
          // by now i will keep it as any type
          const photoInfo: any = await FileSystem.getInfoAsync(photo.uri)

          if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
            return toast.show({
              title:
                'A foto escolhida é maior que 5MB, por favor escolha uma foto com tamanho menor',
              bg: 'red.500',
              placement: 'top',
            })
          }

          const fileExtension = photo.uri.split('.').pop()

          const photoFile = {
            name: `a.${fileExtension}`.toLocaleLowerCase(),
            uri: photo.uri,
            type: `${photo.type}/${fileExtension}`,
            isNew: true,
          } as PhotoType

          setAdPhotos((prevState) => prevState.concat(photoFile))
        }
      })
    } catch (error) {
      toast.show({
        title: 'Não foi possível selecionar a foto',
        bg: 'red.500',
        placement: 'top',
      })
    } finally {
      setIsPhotoLoading(false)
    }
  }

  function handleRemovePhoto(index: number): void {
    setAdPhotos((prevState) => {
      const updatedPhotos = [...prevState]
      updatedPhotos.splice(index, 1)
      return updatedPhotos
    })
  }

  function handleAdvance(product: NewProductFormProps) {
    // these two lines below is just a trick to resolve type issues,
    // beside Form validations is taking care of these values to be
    // not undefined on product.accept_trade, and be only "new" or
    // "used" on product.condition, the NewProductFormProps type
    //  doesnt know that and it was giving error type
    const acceptTrade = product.accept_trade ?? false
    const condition = product.condition === 'new' ? 'new' : 'used'

    if (adPhotos.length > 0) {
      navigation.navigate('previewAd', {
        productImgs: adPhotos,
        title: product.title,
        acceptTrade,
        condition,
        description: product.description,
        paymentMethods: product.payment_methods,
        price: product.price,
      })
    } else {
      return toast.show({
        title: 'Por favor selecione ao menos uma foto do produto anunciado',
        bg: 'red.500',
        placement: 'top',
      })
    }
  }

  function resetForm() {
    reset(defaultValues)
    setAdPhotos([])
  }

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        resetForm()
      }
    }, []),
  )

  return (
    <>
      <ScrollView px={'24px'}>
        <Text color={'gray.600'} fontSize={'md'} fontFamily={'heading'}>
          Imagens
        </Text>
        <Text color={'gray.500'} mt={'4px'}>
          Escolha até 3 imagens para mostrar o quanto o seu produto é incrível
        </Text>

        <HStack style={{ gap: 8 }} mt={'16px'}>
          {adPhotos.length > 0 &&
            adPhotos.map((item, index) => (
              <ProductFrame
                key={item.uri}
                imgPath={item.uri}
                onRemove={() => handleRemovePhoto(index)}
              />
            ))}

          {adPhotos.length < 3 && (
            <EmptyFrame handlePress={handleProductPhotoSelection} />
          )}
        </HStack>

        <Box style={{ gap: 16 }}>
          <Text
            color={'gray.600'}
            fontSize={'md'}
            fontFamily={'heading'}
            mt={'32px'}
          >
            Sobre o produto
          </Text>

          <Controller
            name="title"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Título do anúncio"
                bgColor={'gray.100'}
                borderRadius="6px"
                paddingX={'12px'}
                paddingY={'16px'}
                fontSize={'md'}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <ErrorMessage
            errors={errors}
            name="title"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextArea
                autoCompleteType={'text'}
                placeholder="Descrição do Produto"
                bgColor={'gray.100'}
                borderRadius="6px"
                paddingX={'12px'}
                paddingY={'16px'}
                fontSize={'md'}
                h={'160px'}
                w={'100%'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <ErrorMessage
            errors={errors}
            name="description"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            control={control}
            name="condition"
            render={({ field: { value, onChange } }) => (
              <FormControl>
                <Radio.Group
                  name="condition"
                  accessibilityLabel="selecione se o produto é novo ou usado"
                  value={value}
                  onChange={onChange}
                >
                  <HStack style={{ gap: 10 }}>
                    <Radio value="new">Produto Novo</Radio>
                    <Radio value="used">Produto Usado</Radio>
                  </HStack>
                </Radio.Group>
              </FormControl>
            )}
          />

          <ErrorMessage
            errors={errors}
            name="condition"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />
        </Box>

        <Box mt={'33px'} style={{ gap: 16 }} pb={'26px'}>
          <Text color={'gray.600'} fontSize={'md'} fontFamily={'heading'}>
            Venda
          </Text>

          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Valor do produto"
                bgColor={'gray.100'}
                borderRadius="6px"
                paddingX={'12px'}
                paddingY={'16px'}
                fontSize={'md'}
                keyboardType="numeric"
                onChangeText={onChange}
                value={value !== undefined ? value.toString() : undefined}
                leftElement={
                  <Text pl={'16px'} fontSize={'md'}>
                    R$
                  </Text>
                }
              />
            )}
          />

          <ErrorMessage
            errors={errors}
            name="price"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <VStack>
            <Text color={'gray.600'} fontSize={'sm'} fontFamily={'heading'}>
              Aceita troca?
            </Text>
            <HStack>
              <Controller
                control={control}
                name="accept_trade"
                render={({ field: { value, onChange } }) => (
                  <FormControl flex={1} flexDirection="row">
                    <Switch
                      isChecked={value}
                      onToggle={onChange}
                      onTrackColor="blue.500"
                      size={'lg'}
                    />
                  </FormControl>
                )}
              />
            </HStack>
          </VStack>

          <Controller
            name="payment_methods"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl flex={1} flexDirection="row">
                <PaymentMethods value={value} onChange={onChange} />
              </FormControl>
            )}
          />

          <ErrorMessage
            errors={errors}
            name="payment_methods"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />
        </Box>
      </ScrollView>
      <HStack
        py={'20px'}
        height={'90px'}
        bgColor={'gray.100'}
        justifyContent={'space-evenly'}
        alignItems={'center'}
      >
        <ButtonToken
          message="Cancelar"
          onPress={handleCancel}
          variant="GRAY"
          w={'157.5px'}
          h={'42px'}
        />
        <ButtonToken
          message="Avançar"
          onPress={handleSubmit(handleAdvance)}
          variant="BLACK"
          w={'157.5px'}
          h={'42px'}
        />
      </HStack>
    </>
  )
}
