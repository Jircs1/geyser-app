import { useLazyQuery } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import Loader from '../../components/ui/Loader';
import { customHistory } from '../../config';
import { QUERY_PROJECT_BY_NAME } from '../../graphql';
import { NotFound } from '../notFound';
import Activity from '../project/Activity/Activity';
import {DetailsContainer} from './DetailsContainer';
import { useFundingFlow } from '../../hooks';
import { useAuthContext } from '../../context';

export const ProjectView = () => {
	const { projectId } = useParams<{ projectId: string }>();
	const { state } = useLocation<{ loggedOut?: boolean }>();

	const {setNavTitle} = useAuthContext();

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

	const [getProject, { loading, error, data }] = useLazyQuery(QUERY_PROJECT_BY_NAME,
		{
			variables: { where: { name: projectId } },
			onCompleted(data) {
				setNavTitle(data.project.title);
			},
		},
	);

	if (loading) {
		return (
			<Loader />
		);
	}

	if (error || !data || !data.project) {
		return <NotFound />;
	}

	const { project } = data;

	console.log('checking project data', project);

	return (
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
				<DetailsContainer project={project} {...{detailOpen, setDetailOpen, setFundState }}/>
				<Activity project={project} {...{detailOpen, setDetailOpen, fundingFlow }}/>
			</Box>
		</Box>

	);
};
