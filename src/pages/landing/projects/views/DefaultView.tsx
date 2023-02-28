import { CardLayout } from '../../../../components/layouts'
import {
  ProjectsDisplay,
  ProjectsDisplayMostFundedThisWeek,
} from '../components'
import { FeaturedProjectCard } from '../elements'

const listOfTags = [
  { label: 'education', id: 41 },
  { label: 'culture', id: 42 },
  { label: 'communities', id: 43 },
  { label: 'games', id: 44 },
]

export const DefaultView = () => {
  return (
    <CardLayout w="full" spacing="50px" padding="20px">
      <FeaturedProjectCard projectName="bitcoinconferenceinlagos" />

      <ProjectsDisplay />
      {listOfTags.map((tag) => {
        return <ProjectsDisplayMostFundedThisWeek key={tag.id} tag={tag} />
      })}
    </CardLayout>
  )
}
