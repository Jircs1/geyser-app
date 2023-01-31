import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react'

import { ButtonComponent } from '../ui'

interface IDeleteConfirmModal {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  confirm: () => any
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  title,
  description,
  confirm,
}: IDeleteConfirmModal) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
    <ModalOverlay />
    <ModalContent display="flex" alignItems="center" padding="20px 20px">
      <ModalHeader>
        <Text fontSize="16px" fontWeight={600}>
          {title}
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack width="100%" spacing="30px">
          <Text>{description}</Text>
          <HStack width="100%" justifyContent="space-between" spacing="20px">
            <ButtonComponent onClick={onClose}>Cancel</ButtonComponent>
            <ButtonComponent backgroundColor="red.500" onClick={confirm}>
              Confirm
            </ButtonComponent>
          </HStack>
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
)
