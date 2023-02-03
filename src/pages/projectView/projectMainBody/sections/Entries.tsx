import { useMutation } from '@apollo/client'
import { Center, Text, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

import { CardLayout } from '../../../../components/layouts'
import {
  ProjectEntryCard,
  ProjectSectionBar,
} from '../../../../components/molecules'
import { ButtonComponent } from '../../../../components/ui'
import { getPath, ID } from '../../../../constants'
import { useAuthContext, useProjectContext } from '../../../../context'
import { MUTATION_DELETE_ENTRY } from '../../../../graphql/mutations'
import { Entry } from '../../../../types'
import { isActive, isDraft, useNotification } from '../../../../utils'

export const Entries = () => {
  const navigate = useNavigate()

  const { user } = useAuthContext()
  const { project } = useProjectContext()
  const { toast } = useNotification()

  const [deleteEntry] = useMutation(MUTATION_DELETE_ENTRY)

  const {
    isOpen: isDeleteEntryOpen,
    onClose: closeDeleteEntry,
    onOpen: openDeleteEntry,
  } = useDisclosure()
  const [selectedEntry, setSelectedEntry] = useState<Entry>()

  const hasEntries = project.entries && project.entries.length > 0
  const entriesLength = project.entries ? project.entries.length : 0

  const isUserOwnerOfCurrentProject: boolean =
    user?.id && user.id === project.owners[0].user.id

  const canCreateEntries: boolean =
    isUserOwnerOfCurrentProject &&
    (isActive(project.status) || isDraft(project.status))

  const handleCreateNewEntry = () => [
    navigate(getPath('projectEntryCreation', project.name)),
  ]

  const handleEntryEditButtonTapped = (entry: Entry) => {
    navigate(getPath('projectEntryDetails', project.name, entry.id))
  }

  const triggerDeleteEntry = (entry: Entry) => {
    setSelectedEntry(entry)
    openDeleteEntry()
  }

  const handleRemoveEntry = async () => {
    if (!selectedEntry || !selectedEntry.id) {
      return
    }

    try {
      await deleteEntry({
        variables: { deleteEntryId: toInt(selectedEntry.id) },
      })

      toast({
        title: 'Successfully removed entry',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to remove entry',
        description: `${error}`,
        status: 'error',
      })
    }

    closeDeleteEntry()
  }

  const renderEntries = () => {
    if (project.entries && project.entries.length > 0) {
      const sortedEntries =
        project.entries &&
        project.entries.sort(
          (a, b) =>
            parseInt(b?.createdAt || '', 10) - parseInt(a?.createdAt || '', 10),
        )
      return sortedEntries.map((entry) => {
        if (entry) {
          const entryWithProject = { ...entry, project }
          return <ProjectEntryCard entry={entryWithProject} key={entry.id} />
        }
      })
    }

    return <Text>There are no any entries available </Text>
  }

  if (!hasEntries && !isUserOwnerOfCurrentProject) {
    return null
  }

  return (
    <CardLayout
      width="100%"
      alignItems="flex-start"
      spacing="20px"
      id={ID.project.view.entries}
      flexDirection="column"
      padding="24px"
    >
      <ProjectSectionBar name={'Entries'} number={entriesLength} />

      {renderEntries()}

      {isUserOwnerOfCurrentProject && (
        <>
          <ButtonComponent
            onClick={handleCreateNewEntry}
            w="full"
            disabled={Boolean(canCreateEntries) === false}
          >
            <BiPlus style={{ marginRight: '10px' }} />
            Create A New Entry
          </ButtonComponent>

          {Boolean(canCreateEntries) === false ? (
            <Center>
              <Text
                textColor={'brand.neutral600'}
                textAlign="center"
                paddingX={2}
              >
                You cannot publish an entry in an inactive project. Finish the
                project configuration or re-activate the project to publish this
                entry.
              </Text>
            </Center>
          ) : null}
        </>
      )}
    </CardLayout>
  )
}
