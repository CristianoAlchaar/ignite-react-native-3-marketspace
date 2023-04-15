/* eslint-disable no-unneeded-ternary */

import { useRef, useState } from 'react'

import { Image, View, Center } from 'native-base'

import { Dimensions } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { PhotoType } from 'src/@types/photoType'

interface ImageCarouselProps {
  images: PhotoType[]
}

const WIDTH = Dimensions.get('window').width
const DOT_WITH = WIDTH / 3 - 20
export function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const isCarousel = useRef(null)

  const renderItem = ({ item }: { item: PhotoType }) => {
    return (
      <View>
        <Image
          source={{ uri: item.uri }}
          style={{ width: '100%', height: 280 }}
          alt=""
        />
      </View>
    )
  }

  return (
    <View h={280}>
      <Carousel
        data={images}
        renderItem={renderItem}
        ref={isCarousel}
        sliderWidth={WIDTH}
        itemWidth={WIDTH}
        layout="default"
        loop={false}
        autoplay={false}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
        enableSnap={true}
      />
      <Center style={{ position: 'absolute', bottom: -20 }} w={'100%'}>
        <Pagination
          dotsLength={images.length}
          activeDotIndex={index}
          dotStyle={{
            width: DOT_WITH,
            height: 3,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: '#F7F7F8',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={1}
          tappableDots={false}
        />
      </Center>
    </View>
  )
}
