import { useQuery } from '@apollo/client'
import { useMemo } from 'react'

import { QUERY_GRANTS } from '../../../graphql/queries/grant'
import { Grant, GrantStatusEnum } from '../../../types'
import { toInt } from '../../../utils'

type ResponseData = {
  grants: Grant[]
}

export const useGrants = () => {
  const { data, error, loading, refetch } = useQuery<ResponseData>(QUERY_GRANTS)

  const activeGrant = useMemo(
    () => (data ? (data.grants.find((grant) => grant.status !== GrantStatusEnum.Closed) as Grant) : null),
    [data],
  )

  const latestGrant = useMemo(() => {
    if (data) {
      const grantsCopy = [...data.grants]
      grantsCopy.sort((a, b) => toInt(b.id) - toInt(a.id))
      if (grantsCopy[0]) {
        return grantsCopy[0]
      }

      return null
    }

    return null
  }, [data])

  const inactiveGrants = useMemo(
    () =>
      data
        ? data.grants
            .filter((grant) => grant.status === GrantStatusEnum.Closed)
            .sort((a, b) => {
              const statusA = a.statuses.find((s) => s.status === GrantStatusEnum.Closed) || { endAt: 0 }
              const statusB = b.statuses.find((s) => s.status === GrantStatusEnum.Closed) || { endAt: 0 }

              return statusB.endAt - statusA.endAt
            })
        : [],
    [data],
  )

  return {
    grants: data ? data.grants : null,
    error,
    loading,
    refetch,
    activeGrant,
    inactiveGrants,
    latestGrant,
  }
}
