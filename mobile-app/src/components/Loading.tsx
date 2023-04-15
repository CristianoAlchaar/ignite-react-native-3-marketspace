import { Spinner, Center } from 'native-base'
export function Loading() {
  return (
    <Center flex={1}>
      <Spinner color="green.500" size={'lg'} />
    </Center>
  )
}
