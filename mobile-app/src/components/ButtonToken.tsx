import { ReactElement } from 'react'
import { Button, IButtonProps } from 'native-base'

interface ButtonProps extends IButtonProps {
  message: string
  variant?: 'BLACK' | 'BLUE' | 'GRAY'
  onPress: () => void
  leftElement?: ReactElement
}

export function ButtonToken({
  message,
  variant = 'BLACK',
  onPress,
  leftElement = undefined,
  ...rest
}: ButtonProps) {
  return (
    <Button
      leftIcon={leftElement !== undefined ? leftElement : undefined}
      padding="12px"
      borderRadius={'6px'}
      bgColor={
        variant === 'BLACK'
          ? 'gray.700'
          : variant === 'BLUE'
          ? 'blue.300'
          : 'gray.300'
      }
      _text={{
        color: `${variant === 'GRAY' ? 'gray.500' : 'gray.100'}`,
        fontFamily: 'heading',
        fontSize: 'sm',
      }}
      onPress={onPress}
      {...rest}
    >
      {message}
    </Button>
  )
}
