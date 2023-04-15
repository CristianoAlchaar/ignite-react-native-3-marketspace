import ProductImg from '@assets/shoe.png'
import { ImageSourcePropType } from 'react-native'

interface paymentMethods {
  Billet: 'Boleto'
  Pix: 'Pix'
  Money: 'Dinheiro'
  CreditCard: 'Cartão de Crédito'
  BankDeposit: 'Depósito Bancário'
}

export interface Advertisement {
  id: string
  condition: 'NEW' | 'USED'
  price: string
  imgUrl: ImageSourcePropType
  description: string
  title: string
  paymentMethod: Array<keyof paymentMethods>
  acceptExchange: boolean
}

interface userAdvertisement extends Advertisement {
  isDisabled?: boolean
}

export const temporarySellingList: Advertisement[] = [
  {
    id: '1',
    condition: 'NEW',
    price: '59.90',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['Billet', 'Pix', 'CreditCard'],
    acceptExchange: true,
  },
  {
    id: '2',
    condition: 'USED',
    price: '32.80',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['Pix', 'Money', 'BankDeposit'],
    acceptExchange: false,
  },
  {
    id: '3',
    condition: 'USED',
    price: '102.40',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['CreditCard', 'BankDeposit'],
    acceptExchange: true,
  },
  {
    id: '4',
    condition: 'NEW',
    price: '73.80',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['Billet', 'CreditCard', 'BankDeposit'],
    acceptExchange: false,
  },
  {
    id: '5',
    condition: 'USED',
    price: '23.30',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['Pix', 'Money'],
    acceptExchange: true,
  },
  {
    id: '6',
    condition: 'NEW',
    price: '45.50',
    title: 'Product',
    imgUrl: ProductImg,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    paymentMethod: ['Billet', 'CreditCard'],
    acceptExchange: true,
  },
]

export const PersonalSellingList: userAdvertisement[] = [
  {
    id: '1',
    condition: 'NEW',
    price: '59.90',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['Billet', 'CreditCard'],
    isDisabled: false,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: true,
  },
  {
    id: '2',
    condition: 'USED',
    price: '32.80',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['Pix', 'Money'],
    isDisabled: false,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: true,
  },
  {
    id: '3',
    condition: 'USED',
    price: '102.40',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['CreditCard', 'BankDeposit'],
    isDisabled: false,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: true,
  },
  {
    id: '4',
    condition: 'NEW',
    price: '73.80',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['Billet'],
    isDisabled: true,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: true,
  },
  {
    id: '5',
    condition: 'USED',
    price: '102.40',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['CreditCard', 'BankDeposit'],
    isDisabled: false,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: false,
  },
  {
    id: '6',
    condition: 'USED',
    price: '32.80',
    title: 'Product',
    imgUrl: ProductImg,
    paymentMethod: ['Pix', 'Money'],
    isDisabled: false,
    description: 'lorem ipsum dolor sit amet, consectetur adip',
    acceptExchange: false,
  },
]
