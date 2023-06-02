import { ButtonGroup } from '@chakra-ui/react'
import { RiH1, RiH2, RiH3 } from 'react-icons/ri'

import { ToolbarCommandButton } from '../commands/ToolbarCommandButton'
import { useToolbarCommand } from '../commands/useToolbarCommand'

const headingsArray = [
  { level: 1, Icon: RiH1, name: 'H1' },
  { level: 2, Icon: RiH2, name: 'H2' },
  { level: 3, Icon: RiH3, name: 'H3' },
]

export const ToolbarHeading = () => {
  const { runCommand, isDisabled, isActive } = useToolbarCommand(
    'heading',
    'toggleHeading',
  )

  return (
    <ButtonGroup isAttached>
      {headingsArray.map(({ level, name, Icon }) => (
        <ToolbarCommandButton
          isDisabled={isDisabled()}
          isActive={isActive({ level })}
          name={name}
          label={name}
          key={level}
          onClick={() => runCommand({ level })}
        >
          <Icon />
        </ToolbarCommandButton>
      ))}
    </ButtonGroup>
  )
}
