import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  HStack,
  Menu,
  VStack,
} from '@chakra-ui/react'
import { BsSliders } from 'react-icons/bs'

import { Body1 } from '../../../../components/typography'
import { useFilterContext } from '../../../../context'
import { colors } from '../../../../styles'
import { getCurrentSelection, SortBody } from './SortMenu'

type MobileSortProps = AccordionItemProps

export const MobileSort = ({ ...rest }: MobileSortProps) => {
  const { sort } = useFilterContext()
  return (
    <AccordionItem {...rest}>
      <AccordionButton paddingY="15px">
        <HStack width="100%">
          <BsSliders fontSize="16px" color={colors.neutral600} />
          <Body1 fontSize="16px" color={colors.neutral800}>
            {getCurrentSelection(sort)}
          </Body1>
        </HStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel
        as={VStack}
        overflow="hidden"
        paddingX="0px"
        maxHeight="500px"
      >
        <Menu isOpen={true}>
          <SortBody />
        </Menu>
      </AccordionPanel>
    </AccordionItem>
  )
}
