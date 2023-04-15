import { Checkbox, Text, VStack } from 'native-base'
import React from 'react'

interface PaymentMethodProps {
  value: string[]
  onChange: () => void
}

export function PaymentMethods({ onChange, value }: PaymentMethodProps) {
  return (
    <VStack>
      <Text mb={'15px'} fontFamily="heading" color="gray.600">
        Meios de pagamentos aceitos
      </Text>
      <Checkbox.Group
        onChange={onChange}
        value={value}
        accessibilityLabel="Escolha as formas de pagamento"
        style={{ gap: 11 }}
        colorScheme={'blue'}
      >
        <Checkbox value="boleto">Boleto</Checkbox>
        <Checkbox value="pix">Pix</Checkbox>
        <Checkbox value="cash">Dinheiro</Checkbox>
        <Checkbox value="card">Cartão de Crédito</Checkbox>
        <Checkbox value="deposit">Depósito Bancário</Checkbox>
      </Checkbox.Group>
    </VStack>
  )
}
