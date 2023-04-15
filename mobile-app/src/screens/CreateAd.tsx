import { useNavigation } from '@react-navigation/native'

import { HStack, Pressable, theme, VStack, Text } from 'native-base'

import { CreateAdForm } from '@components/CreateAdForm'

import { ArrowLeft } from 'phosphor-react-native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

export function CreateAd() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.navigate('home')
  }

  return (
    <VStack flex={1} bgColor={'gray.200'}>
      <VStack flex={1}>
        <HStack px={'24px'} mt={'64px'} mb={'12px'} alignItems={'center'}>
          <Pressable onPress={handleGoBack}>
            <ArrowLeft size={'24px'} color={theme.colors.gray[700]} />
          </Pressable>
          <Text
            textAlign="center"
            flex={1}
            fontFamily="heading"
            fontSize={'lg'}
          >
            Criar anúncio
          </Text>
        </HStack>
        <CreateAdForm />
      </VStack>
    </VStack>
  )
}
