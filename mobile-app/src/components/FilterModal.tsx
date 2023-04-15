import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Modal,
  Switch,
} from 'native-base'

import { ButtonToken } from './ButtonToken'
import { ConditionTagForModal } from './ConditionTagForModal'

interface FilterModalProps {
  isShown: boolean
  toggleModal: () => void
  setFilter: Dispatch<SetStateAction<{}>>
}

export function FilterModal({
  isShown,
  toggleModal,
  setFilter,
}: FilterModalProps) {
  const [isNewTagSelected, setIsNewTagSelected] = useState(false)
  const [isUsedTagSelected, setIsUsedTagSelected] = useState(false)

  const [isNew, setIsNew] = useState<boolean>()
  const [isTradeAccepted, setIsTradeAccepted] = useState<boolean>()
  const [paymentMethods, setPaymentMethods] = useState<string[] | undefined>(
    undefined,
  )

  function HandleApplyFilter() {
    const newFilter = {
      is_new: isNew,
      accept_trade: isTradeAccepted,
      payment_methods: paymentMethods,
    }
    setFilter(newFilter)
    setIsNewTagSelected(false)
    setIsUsedTagSelected(false)
    toggleModal()
  }

  function handleResetFilterProduct() {
    setIsTradeAccepted(undefined)
    setIsNew(undefined)
    setPaymentMethods(undefined)
    setFilter({})
    setIsNewTagSelected(false)
    setIsUsedTagSelected(false)
  }

  function handlePaymentMethodsChange(value: string[]) {
    setPaymentMethods(value)
  }

  useEffect(() => {
    const condition =
      isNewTagSelected && !isUsedTagSelected
        ? true
        : isUsedTagSelected && !isNewTagSelected
        ? false
        : undefined
    setIsNew(condition)
  }, [isNewTagSelected, isUsedTagSelected])

  return (
    <Modal isOpen={isShown} onClose={toggleModal}>
      <Modal.Content>
        <Modal.CloseButton onPress={toggleModal} />
        <Modal.Header>Filtrar anúncios</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Condição</FormControl.Label>
            <HStack style={{ gap: 4 }}>
              <ConditionTagForModal
                title="NEW"
                isSelected={isNewTagSelected}
                onPress={() =>
                  isNewTagSelected
                    ? setIsNewTagSelected(false)
                    : setIsNewTagSelected(true)
                }
              />
              <ConditionTagForModal
                title="USED"
                isSelected={isUsedTagSelected}
                onPress={() =>
                  isUsedTagSelected
                    ? setIsUsedTagSelected(false)
                    : setIsUsedTagSelected(true)
                }
              />
            </HStack>
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Aceita troca?</FormControl.Label>
            <HStack>
              <Switch
                value={isTradeAccepted}
                onToggle={() =>
                  isTradeAccepted
                    ? setIsTradeAccepted(false)
                    : setIsTradeAccepted(true)
                }
                onTrackColor="blue.500"
                size={'lg'}
              />
            </HStack>
          </FormControl>
          <Checkbox.Group
            onChange={handlePaymentMethodsChange}
            value={paymentMethods}
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
        </Modal.Body>
        <Modal.Footer>
          <HStack alignItems={'center'}>
            <Button.Group>
              <ButtonToken
                message="Resetar Filtros"
                onPress={handleResetFilterProduct}
                variant="GRAY"
              >
                Resetar Filtros
              </ButtonToken>
              <ButtonToken
                message="Aplicar Filtros"
                onPress={HandleApplyFilter}
                variant="BLACK"
              >
                Aplicar Filtros
              </ButtonToken>
            </Button.Group>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
