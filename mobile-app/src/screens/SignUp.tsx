import { useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import * as yup from 'yup'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import {
  Box,
  Button,
  Center,
  IconButton,
  Image,
  Input,
  ScrollView,
  Text,
  theme,
  VStack,
  useToast,
} from 'native-base'

import { Eye, PencilSimpleLine } from 'phosphor-react-native'

import { ButtonToken } from '@components/ButtonToken'
import { UserPhoto } from '@components/UserPhoto'

import Logo from '@assets/logo.png'
import DafaultAvatarImg from '@assets/default_avatar.png'
import { Alert } from 'react-native'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'

interface FormDataProps {
  name: string
  email: string
  telephone: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o email.').email('E-mail inválido.'),
  telephone: yup
    .string()
    .matches(
      /^\d{11}$/,
      'Telefone inválido, o formato deve ser DD seguido pelo número sem caractéres especiais ou espaços, ex: DDNNNNNNNN',
    )
    .required('Informe o telefone.'),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(20, 'A senha deve ter no máximo 20 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
    )
    .required('Informe a senha.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha.')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
})

export function SignUp() {
  const [userPhoto, setUserPhoto] = useState<any>()
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isAvatarDefined, setIsAvatarDefined] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  })

  async function handleSubmitProfilePicture() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        selectionLimit: 1,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        // photoInfo is type FileSyste.FileInfo however i was getting a type error
        // saying that size is not a property in type FileInfo, but size exists im sure of it
        // by now i will keep it as any type
        const photoInfo: any = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
          { size: true },
        )

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const currentDate = new Date().toLocaleDateString().replace(/\//g, '')

        const photoFile = {
          name: `avatar${currentDate}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any

        setUserPhoto(photoFile)
        setIsAvatarDefined(true)
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto.')
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleTogglePassword() {
    showPassword ? setShowPassword(false) : setShowPassword(true)
  }

  function handleToggleConfirmPassword() {
    showConfirmPassword
      ? setShowConfirmPassword(false)
      : setShowConfirmPassword(true)
  }

  async function handleCreateAccountSubmit({
    name,
    email,
    telephone,
    password,
  }: FormDataProps) {
    if (isAvatarDefined) {
      const formData = new FormData()

      formData.append('avatar', userPhoto)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('tel', telephone)
      formData.append('password', password)

      try {
        setIsSubmiting(true)

        await api.post('/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.show({
          title: 'Conta Criada com sucesso',
          placement: 'top',
          bgColor: 'green.500',
        })

        navigation.navigate('signIn')
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível realizar o cadastro'
        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500',
        })
      } finally {
        setIsSubmiting(false)
      }
    } else {
      toast.show({
        title:
          'Por favor selecione uma foto de perfil para realizar o cadastro',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  function handleGoToLogin() {
    navigation.navigate('signIn')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={'48px'} pt={'64px'} pb={'56px'} bg={'gray.200'}>
        <Center>
          <Image
            source={Logo}
            defaultSource={Logo}
            alt={'Logo Marketspace'}
            w={'60px'}
            h={'40px'}
          />

          <Text
            mt={'12px'}
            color="gray.700"
            fontFamily={'heading'}
            fontSize={'lg'}
          >
            Boas Vindas!
          </Text>

          <Text textAlign={'center'} mt="8px">
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </Center>

        <Center mt={'32px'} style={{ gap: 16 }}>
          <Box>
            <UserPhoto
              source={
                isAvatarDefined ? { uri: userPhoto.uri } : DafaultAvatarImg
              }
              size={88}
              alt="Avatar do Usuário"
            />
            <IconButton
              bgColor={'blue.300'}
              borderRadius={'1000px'}
              size={'40px'}
              style={{
                position: 'absolute',
                bottom: 0,
                right: -10,
              }}
              onPress={handleSubmitProfilePicture}
            >
              <PencilSimpleLine color={theme.colors.gray[200]} size={'16px'} />
            </IconButton>
          </Box>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
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
            name="name"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
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
            name="email"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            control={control}
            name="telephone"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Telefone"
                keyboardType="phone-pad"
                autoCapitalize="none"
                type="text"
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
            name="telephone"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                type={showPassword ? 'text' : 'password'}
                bgColor={'gray.100'}
                borderRadius="6px"
                paddingX={'12px'}
                paddingY={'16px'}
                fontSize={'md'}
                onChangeText={onChange}
                value={value}
                InputRightElement={
                  <Button bgColor={'gray.100'} onPress={handleTogglePassword}>
                    <Eye
                      style={{ width: '20px', height: '20px' }}
                      color={theme.colors.gray[500]}
                    />
                  </Button>
                }
              />
            )}
          />

          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar senha"
                type={showConfirmPassword ? 'text' : 'password'}
                bgColor={'gray.100'}
                borderRadius="6px"
                paddingX={'12px'}
                paddingY={'16px'}
                fontSize={'md'}
                onChangeText={onChange}
                value={value}
                InputRightElement={
                  <Button
                    bgColor={'gray.100'}
                    onPress={handleToggleConfirmPassword}
                  >
                    <Eye
                      style={{ width: '20px', height: '20px' }}
                      color={theme.colors.gray[500]}
                    />
                  </Button>
                }
              />
            )}
          />

          <ErrorMessage
            errors={errors}
            name="password_confirm"
            render={({ message }) => (
              <Text color={'red.500'} fontFamily={'heading'}>
                {message}
              </Text>
            )}
          />
        </Center>

        <ButtonToken
          message="Criar"
          isLoading={isSubmiting}
          onPress={handleSubmit(handleCreateAccountSubmit)}
          mt={'24px'}
        />

        <Center mt={'48px'}>
          <Text>Já tem uma conta?</Text>
          <ButtonToken
            message="Ir para o login"
            onPress={handleGoToLogin}
            variant={'GRAY'}
            mt={'16px'}
            w={'100%'}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
