import { useState } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import * as yup from 'yup'

import {
  VStack,
  Box,
  Image,
  Text,
  Heading,
  Center,
  Input,
  Button,
  theme,
  useToast,
} from 'native-base'

import { SafeAreaView } from 'react-native-safe-area-context'

import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { Eye } from 'phosphor-react-native'

import Logo from '@assets/logo.png'

import { ButtonToken } from '@components/ButtonToken'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'

interface FormDataProps {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup.string().required('Informe o email.'),
  password: yup.string().required('Informe a senha.'),
})

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({ resolver: yupResolver(schema) })

  const toast = useToast()

  const { signIn } = useAuth()

  function handleTogglePassword() {
    showPassword ? setShowPassword(false) : setShowPassword(true)
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleCreateAccountPress() {
    navigation.navigate('signUp')
  }

  return (
    <SafeAreaView>
      <VStack flex={1}>
        <Box
          h={556}
          borderBottomRadius={24}
          pt={'74px'}
          pb={'68px'}
          px={'48px'}
          bgColor={'gray.200'}
        >
          <Center>
            <Image
              source={Logo}
              defaultSource={Logo}
              alt={'Logo Marketspace'}
            />

            <Text
              fontFamily={'heading'}
              color={'gray.700'}
              fontSize={'4xl'}
              mb={'-8px'}
            >
              marketspace
            </Text>
            <Text fontFamily={'body'} color={'gray.500'} fontSize={'sm'}>
              Seu espaço de compra e venda
            </Text>
          </Center>

          <Center mt={'76px'} style={{ gap: 16 }}>
            <Heading fontSize={'sm'} fontFamily={'body'} fontWeight={'medium'}>
              Acesse a sua conta
            </Heading>

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
          </Center>

          <ButtonToken
            message="Entrar"
            onPress={handleSubmit(handleSignIn)}
            variant={'BLUE'}
            mt={'32px'}
            isLoading={isLoading}
          />
        </Box>
        <Center mt={'56px'} height={'76px'} px={'48px'}>
          <Text color="gray.600">Ainda não tem acesso? </Text>
          <ButtonToken
            message="Criar uma conta"
            onPress={handleCreateAccountPress}
            variant={'GRAY'}
            mt={'32px'}
            width={'100%'}
            fontSize={'sm'}
          />
        </Center>
      </VStack>
    </SafeAreaView>
  )
}
