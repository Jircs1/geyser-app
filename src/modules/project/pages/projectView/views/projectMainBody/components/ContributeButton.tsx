import { Button, ButtonProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { BoltIcon } from '../../../../../../../components/icons'
import { isActive } from '../../../../../../../utils'
import { MobileViews, useProjectContext } from '../../../../../context'

export const ContributeButton = (props: ButtonProps) => {
  const { t } = useTranslation()
  const { project, setMobileView } = useProjectContext()

  if (!project) {
    return null
  }

  const isFundingDisabled = !isActive(project.status)

  return (
    <Button
      variant="primary"
      leftIcon={<BoltIcon />}
      onClick={() => setMobileView(MobileViews.funding)}
      isDisabled={isFundingDisabled}
      {...props}
    >
      {t('Contribute')}
    </Button>
  )
}
