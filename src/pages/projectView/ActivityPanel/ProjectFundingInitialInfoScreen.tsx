import { Box, VStack, HStack, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import {
  ProjectActivityActionsToolbar,
  ActivityBrief,
} from '../../../components/molecules';
import { ButtonComponent } from '../../../components/ui';
import { SatoshiIconTilted } from '../../../components/icons';
import {
  aggregateTransactions,
  FundingTxWithCount,
  isMobileMode,
} from '../../../utils';
import {
  Button,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from '@chakra-ui/react';

import { Funder, Project } from '../../../types/generated/graphql';
import { ProjectContributionList } from './ProjectContributionList';
import { ProjectLeaderboardList } from './ProjectLeaderboardList';
import {
  QUERY_GET_FUNDING_TXS_LANDING,
  QUERY_GET_PROJECT_FUNDERS,
} from '../../../graphql';
import { useQueryWithPagination } from '../../../hooks';
import { ProjectNavBar } from '../../../components/nav';
import { MobileViews, useMobileView } from '../containers';

type Props = {
  project: Project;
  handleViewClick: () => void;
  onFundProjectTapped: () => void;
  btcRate: number;
  test?: boolean;
  fundingTx: any;
};

const itemLimit = 50;

export const ProjectFundingInitialInfoScreen = ({
  handleViewClick,
  onFundProjectTapped,
  project,
  test,
  fundingTx,
}: Props) => {
  const isMobile = isMobileMode();
  const [tab, setTab] = useState('activity');
  const { view } = useMobileView();

  const [aggregatedFundingTxs, setAggregatedFundingTxs] = useState<
    FundingTxWithCount[]
  >([]);

  const fundingTxs = useQueryWithPagination<FundingTxWithCount>({
    itemLimit,
    queryName: 'getFundingTxs',
    query: QUERY_GET_FUNDING_TXS_LANDING,
    resultMap: aggregateTransactions,
    where: { projectId: parseInt(project.id, 10) },
  });

  const funders = useQueryWithPagination<Funder>({
    queryName: 'getFunders',
    itemLimit,
    query: QUERY_GET_PROJECT_FUNDERS,
    where: { projectId: parseInt(project.id, 10) },
    orderBy: {
      amountFunded: 'desc',
    },
  });

  useEffect(() => {
    setAggregatedFundingTxs(fundingTxs.data);
  }, [fundingTxs.data]);

  useEffect(() => {
    if (fundingTx && fundingTx.id && fundingTx.status === 'paid') {
      setAggregatedFundingTxs([fundingTx, ...aggregatedFundingTxs]);
    }
  }, [fundingTx]);

  useEffect(() => {
    if (view === MobileViews.contribution) {
      setTab('activity');
    } else if (view === MobileViews.leaderboard) {
      setTab('leaderBoard');
    }
  }, [view]);

  if (test) {
    return <InfoPageSkeleton />;
  }

  const renderActivityList = () => {
    switch (tab) {
      case 'activity':
        return (
          <ProjectContributionList
            fundingTxs={{ ...fundingTxs, data: aggregatedFundingTxs }}
          />
        );
      default:
        return <ProjectLeaderboardList project={project} funders={funders} />;
    }
  };

  const contributionButton = () => {
    return (
      <>
        <Button
          _hover={{ backgroundColor: 'none' }}
          w="100%"
          rounded="none"
          bg="none"
          fontWeight={tab === 'activity' ? 'bold' : 'normal'}
          fontSize="16px"
          marginTop="10px"
          onClick={() => setTab('activity')}
        >
          Contributions{' '}
          <Text ml={2} bg="brand.bgGrey" rounded="lg" px={3} py={1}>
            {project.fundingTxsCount}
          </Text>
        </Button>
        <Box
          bg={tab === 'activity' ? 'darkgrey' : 'lightgrey'}
          w="100%"
          h="3px"
          rounded="lg"
        ></Box>
      </>
    );
  };

  const leaderBoardButton = () => {
    return (
      <>
        <Button
          _hover={{ backgroundColor: 'none' }}
          w="100%"
          rounded="none"
          bg="none"
          fontWeight={tab === 'activity' ? 'normal' : 'bold'}
          fontSize="16px"
          marginTop="10px"
          onClick={() => setTab('leaderboard')}
        >
          Leaderboard{' '}
          <Text ml={2} bg="brand.bgGrey" rounded="lg" px={3} py={1}>
            {project.fundersCount}
          </Text>
        </Button>
        <Box
          bg={tab === 'activity' ? 'lightgrey' : 'darkgrey'}
          w="100%"
          h="3px"
          rounded="lg"
        ></Box>
      </>
    );
  };

  const renderTabsList = () => {
    if (isMobile) {
      switch (view) {
        case MobileViews.contribution:
          return <Box w="100%">{contributionButton()}</Box>;
        case MobileViews.leaderboard:
          return <Box w="100%">{leaderBoardButton()}</Box>;
        default:
      }
    }

    return (
      <>
        <Box w="50%">{contributionButton()}</Box>
        <Box w="50%">{leaderBoardButton()}</Box>
      </>
    );
  };

  return (
    <VStack
      padding={isMobile ? '10px 5px 0px 5px' : '10px 20px'}
      spacing="12px"
      width="100%"
      height="100%"
      overflowY="hidden"
      position="relative"
    >
      <ActivityBrief project={project} />

      {!isMobile ? (
        <ButtonComponent
          standard
          leftIcon={<SatoshiIconTilted />}
          width="100%"
          backgroundColor={
            project.active ? 'brand.primary' : 'brand.grayPlaceholder'
          }
          onClick={onFundProjectTapped}
          isDisabled={project.active === false}
        >
          Contribute
        </ButtonComponent>
      ) : null}

      <ProjectActivityActionsToolbar
        fundButtonFunction={onFundProjectTapped}
        transitionButtonFunction={handleViewClick}
      />

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden"
        flex="1"
      >
        <Box display="flex" marginBottom="10px" w="95%">
          {renderTabsList()}
        </Box>
        {renderActivityList()}
      </Box>
    </VStack>
  );
};

export const InfoPageSkeleton = () => {
  const isMobile = isMobileMode();

  return (
    <VStack
      padding={isMobile ? '10px 5px 0px 5px' : '10px 20px'}
      spacing="15px"
      width="100%"
      height="100%"
      overflowY="hidden"
      position="relative"
    >
      <SkeletonText noOfLines={3} width="185px" />
      <SkeletonCircle height="208px" width="208px" marginY="30px" />
      <Skeleton height="40px" width="100%" />

      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden"
        flex="1"
      >
        <HStack display="flex" marginBottom="10px" w="95%" spacing="5px">
          <Box w="50%">
            <Skeleton w="100%" h="40px" />
          </Box>
          <Box w="50%">
            <Skeleton w="100%" h="40px" />
          </Box>
        </HStack>
        <VStack
          spacing={'8px'}
          w="95%"
          overflow="auto"
          height={isMobile ? 'calc(100% - 44px)' : '100%'}
          paddingBottom="10px"
        >
          <Skeleton width="100%" height="80px" />
          <Skeleton width="100%" height="80px" />
          <Skeleton width="100%" height="80px" />
          <Skeleton width="100%" height="80px" />
        </VStack>
      </Box>
    </VStack>
  );
};
