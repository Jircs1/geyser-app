import { IconButton, IconButtonProps } from '@chakra-ui/button'
import { useColorModeValue } from '@chakra-ui/system'

import { colors } from '../../styles'

export interface IconButtonComponentProps extends IconButtonProps {
  primary?: boolean
  href?: string
  isExternal?: boolean
  noBorder?: boolean
}

export const IconButtonComponent = ({
  primary,
  noBorder,
  ...rest
}: IconButtonComponentProps) => {
  const backgroundColor = useColorModeValue(colors.bgWhite, colors.bgDark)
  const textColor = useColorModeValue(colors.textBlack, colors.textWhite)

  return (
    <IconButton
      variant="solid"
      backgroundColor={
        noBorder ? 'transparent' : primary ? 'brand.primary' : backgroundColor
      }
      borderRadius="50%"
      color={primary ? 'black' : textColor}
      _hover={primary ? { bg: 'brand.primaryTint' } : undefined}
      border={noBorder ? undefined : `1px solid ${colors.neutral300}`}
      {...rest}
    />
  )
}
