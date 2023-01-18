import { useLazyQuery } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Loader from '../../components/ui/Loader';
import { customHistory } from '../../config';
import { QUERY_PROJECT_BY_NAME_OR_ID } from '../../graphql';
import { NotFoundPage } from '../notFound';
import { Head } from '../../config/Head';
import Details from './Details';
import { useFundingFlow } from '../../hooks';
import { Grants } from '../grants/Grants';

export const Project = ({ projectId }: { projectId: string }) => {
  // const { projectId } = useParams<{ projectId: string }>();
  const { state } = useLocation<{ loggedOut?: boolean }>();

  const [detailOpen, setDetailOpen] = useState(true);
  const fundingFlow = useFundingFlow();
  const { setFundState } = fundingFlow;

  useEffect(() => {
    try {
      getProject();
    } catch (_) {
      customHistory.push('/not-found');
    }
  }, [state]);

  const [getProject, { loading, error, data }] = useLazyQuery(
    QUERY_PROJECT_BY_NAME_OR_ID,
    {
      variables: { where: { name: projectId } },
    },
  );

  if (loading) {
    return <Loader />;
  }

  if (error || !data || !data.project) {
    return <NotFoundPage />;
  }

  const { project } = data;

  return (
    <>
      <Head
        title={project.title}
        description={project.description}
        image={project.image}
        type="article"
      />
      {project.type !== 'grant' ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Box
            width="100%"
            height="100%"
            display="flex"
            overflow="hidden"
            position="relative"
            bg="brand.bgGrey4"
          >
            <Details
              project={project}
              {...{ detailOpen, setDetailOpen, setFundState }}
            />
          </Box>
        </Box>
      ) : (
        <>
          <Grants project={project} />
        </>
      )}
    </>
  );
};
