import { PhotoType } from './photoType'

export interface adRouteParams {
  productImgs: PhotoType[]
  title: string
  description: string
  condition: 'new' | 'used'
  acceptTrade: boolean
  price: number
  paymentMethods: string[]
}

export interface userAdDetailsRouteParams extends adRouteParams {
  productId: string
  isActive: boolean
}

export interface adRouteParamsWithIdOptional extends adRouteParams {
  productId?: string
}

export interface previewRouteParams extends adRouteParamsWithIdOptional {
  imagesToBeRemoved?: string[]
}

export interface adDetailsParams {
  productId: string
}
