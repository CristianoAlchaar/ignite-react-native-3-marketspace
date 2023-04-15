export type PaymentMethodsDTO = {
  id: string
  key: 'boleto' | 'pix' | 'cash' | 'card' | 'deposit'
  name: string
}

export type ProductsImageDTO = {
  id: string
  path: string
}

export type ProductDTO = {
  id: string
  name: string
  description: string
  is_new: boolean
  price: number
  accept_trade: boolean
  payment_methods: PaymentMethodsDTO[]
  product_images: ProductsImageDTO[]
  is_active: boolean
  user: {
    avatar: string
    name: string
    tel: string
  }
}
