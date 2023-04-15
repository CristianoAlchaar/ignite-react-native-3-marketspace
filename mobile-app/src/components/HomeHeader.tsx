import { HStack, Text, theme, VStack } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { Plus } from 'phosphor-react-native'

import DafaultAvatarImg from '@assets/default_avatar.png'

import { ButtonToken } from './ButtonToken'
import { UserPhoto } from './UserPhoto'

import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'

export function HomeHeader() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const { user } = useAuth()

  function handleCreateAdAdvertising() {
    navigation.navigate('createAd')
  }

  return (
    <HStack justifyContent={'space-between'}>
      <HStack style={{ gap: 10 }}>
        <UserPhoto
          source={
            user.avatar
              ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
              : DafaultAvatarImg
          }
          alt="Avatar do Usuário"
          size={45}
        />

        <VStack fontSize="md">
          <Text>Boas vindas</Text>
          <Text fontFamily={'heading'}>{user.name}!</Text>
        </VStack>
      </HStack>
      <ButtonToken
        message="Criar anúncio"
        onPress={handleCreateAdAdvertising}
        w={'139px'}
        leftElement={<Plus size={'16px'} color={theme.colors.gray[100]} />}
      />
    </HStack>
  )
}
