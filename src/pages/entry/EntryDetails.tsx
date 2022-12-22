import { Avatar, Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React from 'react';
import { ProjectFundersCountIndicator } from '../../components/molecules';
import { ProjectEntryEditor } from '../creation/entry/editor';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Entry } from '../../types/generated/graphql';
import { getPath } from '../../constants';

type Props = {
  entry: Entry;
};

export const EntryDetails = ({ entry }: Props) => {
  const headerImageSrc = entry.image || entry.project?.image;

  return (
    <VStack width="100%" alignItems="flex-start" height={'100%'}>
      {/* At the moment entries are always tied to a project so we can force unwrap this term */}
      <Link to={getPath('project', entry.project!.name)}>
        <Box
          display="flex"
          size="xs"
          borderWidth="0px"
          boxShadow="none!"
          _hover={{ cursor: 'pointer' }}
        >
          <BiLeftArrowAlt fontSize="15px" />{' '}
          <Text fontSize="10px">View project</Text>
        </Box>
      </Link>

      <Box>
        <Text fontSize="35px" fontWeight={700} color="brand.neutral900">
          {entry.title}
        </Text>
      </Box>

      {headerImageSrc ? (
        <HStack
          width={'100%'}
          justifyContent="center"
          maxHeight="400px"
          borderRadius="4px"
          overflow="hidden"
        >
          <Image width="100%" src={headerImageSrc} />
        </HStack>
      ) : null}

      <HStack width="100%" justifyContent="space-between">
        <Link to={getPath('userProfile', entry.creator.id)}>
          <HStack>
            <Avatar size="sm" src={entry.creator.imageUrl || ''} />
            <Text fontWeight={500}>{entry.creator.username}</Text>
            {entry.published && (
              <Text paddingX="10px" color="brand.neutral900">
                {DateTime.fromMillis(parseInt(entry.publishedAt!, 10)).toFormat(
                  'dd LLL yyyy',
                )}
              </Text>
            )}
          </HStack>
        </Link>
        <ProjectFundersCountIndicator count={entry.fundersCount} />
      </HStack>

      <Text fontSize="18px" fontWeight={600}>
        {entry.description}
      </Text>

      <Box flex={1} width="100%">
        {entry.content && (
          <ProjectEntryEditor name="content" value={entry.content} isReadOnly />
        )}
      </Box>
    </VStack>
  );
};