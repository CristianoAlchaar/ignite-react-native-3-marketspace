import { Box, HStack, ScrollView, Text, theme, View, VStack } from 'native-base'

import { useAuth } from '@hooks/useAuth'

import { api } from '@services/api'

import { Barcode, QrCode, Money, CreditCard, Bank } from 'phosphor-react-native'

import { UserPhoto } from './UserPhoto'
import { ProductTag } from './ProductTag'
import { ImageCarousel } from './ImageCarousel'

import DefaultProfileImg from '@assets/default_avatar.png'

import { PhotoType } from 'src/@types/photoType'

// if is not userAd, its necessary to pass by props a anouncer
interface LargeAdvertiseProps {
  isDisabled?: boolean
  isUserAd?: boolean
  anouncer?: {
    avatar: string
    name: string
    tel: string
  }
  productImgs: PhotoType[]
  title: string
  description: string
  condition: 'new' | 'used'
  acceptTrade: boolean
  price: number
  paymentMethods: string[]
}

export function LargeAdvertise({
  isDisabled = false,
  isUserAd = false,
  anouncer = undefined,
  productImgs,
  title,
  description,
  condition,
  acceptTrade,
  price,
  paymentMethods,
}: LargeAdvertiseProps) {
  const { user } = useAuth()

  const hStackComponents = [
    {
      component: (
        <HStack style={{ gap: 2 }} alignItems={'center'} key="1">
          <Barcode color={theme.colors.gray[600]} size={'18px'} />
          <Text>Boleto</Text>
        </HStack>
      ),
      value: 'boleto',
    },
    {
      component: (
        <HStack style={{ gap: 2 }} alignItems={'center'} key="2">
          <QrCode color={theme.colors.gray[600]} size={'18px'} />
          <Text>Pix</Text>
        </HStack>
      ),
      value: 'pix',
    },
    {
      component: (
        <HStack style={{ gap: 2 }} alignItems={'center'} key="3">
          <Money color={theme.colors.gray[600]} size={'18px'} />
          <Text>Dinheiro</Text>
        </HStack>
      ),
      value: 'cash',
    },
    {
      component: (
        <HStack style={{ gap: 2 }} alignItems={'center'} key="4">
          <CreditCard color={theme.colors.gray[600]} size={'18px'} />
          <Text>Cartão de Crédito</Text>
        </HStack>
      ),
      value: 'card',
    },
    {
      component: (
        <HStack style={{ gap: 2 }} alignItems={'center'} key="5">
          <Bank color={theme.colors.gray[600]} size={'18px'} />
          <Text>Depósito Bancário</Text>
        </HStack>
      ),
      value: 'deposit',
    },
  ]

  const compatibleHStackComponents = hStackComponents.filter((component) =>
    paymentMethods.includes(component.value),
  )
  return (
    <ScrollView>
      <View bgColor={isDisabled ? 'rgba(0,0,0,0.6)' : ''} zIndex={2}>
        <View opacity={isDisabled ? 0.2 : 1}>
          <ImageCarousel images={productImgs} />
        </View>
        {isDisabled && (
          <Box
            h={'280px'}
            w={'100%'}
            position="absolute"
            zIndex={3}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Text color="#FFF" fontFamily={'heading'} fontSize={'md'}>
              ANÚNCIO DESATIVADO
            </Text>
          </Box>
        )}
      </View>
      <Box mt={'20px'} pb={'26px'} px={'24px'}>
        <HStack style={{ gap: 4 }} alignItems={'center'}>
          <UserPhoto
            size={9}
            source={
              isUserAd === true
                ? { uri: `${api.defaults.baseURL}/images/${user.avatar}` }
                : anouncer
                ? { uri: `${api.defaults.baseURL}/images/${anouncer.avatar}` }
                : DefaultProfileImg
            }
            alt="Avatar do Vendedor"
          />
          <Text fontSize={'md'}>
            {isUserAd === true ? user.name : anouncer ? anouncer.name : ''}
          </Text>
        </HStack>

        <Box mt={'27px'}>
          {condition === 'new' ? (
            <ProductTag condition="NEW" />
          ) : (
            <ProductTag condition="USED" />
          )}
          <HStack mt={'10px'} justifyContent={'space-between'}>
            <Text fontFamily="heading" fontSize={'lg'}>
              {title}
            </Text>
            <HStack alignItems={'baseline'}>
              <Text fontSize={'md'} color={'blue.300'} fontFamily={'heading'}>
                R$
              </Text>
              <Text fontSize={'lg'} color={'blue.300'} fontFamily={'heading'}>
                {price.toFixed(2)}
              </Text>
            </HStack>
          </HStack>
          <Text color={'gray.600'} textAlign={'justify'} mt={'8px'}>
            {description}
          </Text>
        </Box>

        <Box mt={'24px'}>
          <HStack>
            <Text fontFamily="heading" color={'gray.600'} mr={'8px'}>
              Aceita troca?
            </Text>
            <Text>{acceptTrade === true ? 'Sim' : 'Não'}</Text>
          </HStack>

          <Text fontFamily="heading" my={'16px'} color={'gray.600'}>
            Meios de pagamento:
          </Text>

          <VStack style={{ gap: 4 }}>
            {compatibleHStackComponents.map((component) => component.component)}
          </VStack>
        </Box>
      </Box>
    </ScrollView>
  )
}
