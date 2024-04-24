import { Box, Image } from '@chakra-ui/react'

import { Body1, Caption } from '../../../../../components/typography'
import { RewardCategory } from '../types'

interface RewardTemplateProps {
  reward: {
    title: string
    image: string
    category: RewardCategory
    description: string
  }
  onClick: () => void
}

export const RewardTemplate = ({ reward, onClick }: RewardTemplateProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      borderRadius="8px"
      border="2px solid"
      borderColor="neutral.100"
      padding={2}
      width="100%"
      transition="transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
      _hover={{
        transform: 'scale(1.05)',
        borderColor: 'primary.400',
      }}
      onClick={onClick}
      cursor="pointer"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        width="100%"
        height="60px"
        alignItems={'center'}
        justifyContent={'flex-start'}
      >
        <Body1 bold fontSize="14px" color="neutral.900" fontWeight="500">
          {reward.title}
        </Body1>
        <Caption fontSize="11px" color="neutral.900" fontWeight="400">
          {reward.description}
        </Caption>
      </Box>
      <Box height="100px" maxHeight="200px">
        <Image h={'100%'} src={reward.image} objectFit="contain" borderRadius="8px" />
      </Box>
    </Box>
  )
}
