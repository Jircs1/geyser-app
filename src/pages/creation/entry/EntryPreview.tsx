import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Image,
  Input,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { useHistory, useParams } from 'react-router';
import { ButtonComponent, TextBox } from '../../../components/ui';
import Loader from '../../../components/ui/Loader';
import { getPath } from '../../../constants';
import { useAuthContext } from '../../../context';
import { QUERY_PROJECT_BY_NAME } from '../../../graphql';
import {
  MUTATION_PUBLISH_ENTRY,
  MUTATION_UPDATE_ENTRY,
} from '../../../graphql/mutations/entries';
import { QUERY_GET_ENTRY } from '../../../graphql/queries/entries';
import { IEntryUpdateInput } from '../../../interfaces/entry';
import { isMobileMode, useNotification } from '../../../utils';
import { defaultEntry } from './editor';
import { CreateNav } from './editor/CreateNav';
import { TEntry } from './types';

let isEdited = false;

export const EntryPreview = () => {
  const params = useParams<{ entryId: string; projectId: string }>();

  const isMobile = isMobileMode();
  const { toast } = useNotification();
  const history = useHistory();
  const { setNav } = useAuthContext();

  const [isEntryPublished, setIsEntryPublished] = useState(false);

  const [entry, setEntry] = useState<TEntry>(defaultEntry);

  const [getPost, { loading: loadingPosts, error, data: entryData }] =
    useLazyQuery(QUERY_GET_ENTRY);

  const [updatePost, { data: updateData, loading: updatePostLoading }] =
    useMutation(MUTATION_UPDATE_ENTRY);

  const [publishPost, publishData] = useMutation(MUTATION_PUBLISH_ENTRY);

  const { loading, data: projectData } = useQuery(QUERY_PROJECT_BY_NAME, {
    variables: { where: { name: params.projectId } },
    onCompleted(data) {
      setNav({
        title: data.project.title,
        path: `/projects/${data.project.name}`,
      });
    },
    onError() {
      history.push(getPath('notFound'));
    },
  });

  useEffect(() => {
    if (params && params.entryId) {
      getPost({ variables: { id: params.entryId } });
    }
  }, [params]);

  useEffect(() => {
    if (entryData && entryData.entry) {
      setEntry(entryData.entry);
    }
  }, [entryData]);

  const handleUpdateEntry = async () => {
    if (entry) {
      const { image, title, description, content, id } = entry;
      try {
        const input: IEntryUpdateInput = {
          entryId: id,
          title,
          description,
          content,
          image,
        };
        await updatePost({ variables: { input } });
        isEdited = false;
      } catch (error) {
        toast({
          title: 'Post update failed',
          description: 'Please try again later',
          status: 'error',
        });
      }
    }
  };

  const onSave = () => {
    if (entry) {
      handleUpdateEntry();
    }
  };

  const onBack = () => {
    history.push(`/projects/${params.projectId}/entry/${params.entryId}`);
  };

  const handleInput = (event: any) => {
    const { name, value } = event.target;
    if (name) {
      const newForm = { ...entry, [name]: value };
      setEntry(newForm);
      isEdited = true;
    }
  };

  const handlePublish = async () => {
    try {
      if (isEdited) {
        await handleUpdateEntry();
      }

      await publishPost({ variables: { id: entry.id } });
    } catch (error) {
      toast({
        title: 'Post publish failed',
        description: 'Please try again later',
        status: 'error',
      });
    }

    setIsEntryPublished(true);
  };

  const handleGotoPost = () => {
    history.push(`/entry/${params.entryId}`);
  };

  if (loadingPosts || loading) {
    return <Loader />;
  }

  return (
    <>
      <CreateNav
        isSaving={updatePostLoading}
        saveText={updatePostLoading ? 'Saving...' : 'Saved'}
        onSave={onSave}
        onBack={onBack}
      />
      <VStack
        background={'brand.bgGrey4'}
        position="relative"
        paddingTop={isMobile ? '150px' : '130px'}
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <VStack
          spacing="20px"
          width="100%"
          // height="100%"
          maxWidth="380px"
          padding={'0px 10px'}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          paddingBottom="80px"
        >
          <Text fontSize="33px" fontWeight={600} color="brand.gray500">
            {isEntryPublished ? 'Share entry' : 'Publish entry'}
          </Text>

          {isEntryPublished && (
            <VStack width="100%" alignItems="center">
              <Box
                borderRadius="50%"
                backgroundColor="brand.primary"
                padding="10px"
              >
                <BsCheckLg />
              </Box>
              <Text>Your entry is live!</Text>
            </VStack>
          )}
          <Text fontSize="14px" color="brand.neutral800">
            {!isEntryPublished ? 'Edit Social Preview' : 'Preview'}{' '}
          </Text>
          <VStack
            alignItems="flex-start"
            backgroundColor="white"
            border="1px solid"
            borderColor="brand.neutral200"
            borderRadius="4px"
            padding="3px"
          >
            {entry.image && (
              <Box height="220px" width="350px" overflow="hidden">
                <Image
                  src={entry.image}
                  height="350px"
                  width="350px"
                  objectFit="cover"
                />
              </Box>
            )}
            <Text
              fontSize="11px"
              color="brand.gray500"
            >{`geyser.fund/${projectData?.project?.name}`}</Text>
            <Input
              border="none"
              _focus={{ border: 'none' }}
              placeholder="Title"
              color="brand.gray500"
              fontSize="28px"
              fontWeight={700}
              marginTop="20px"
              paddingX="0"
              name="title"
              value={entry.title}
              onChange={handleInput}
              disabled={isEntryPublished}
            />
            <Input
              border="none"
              _focus={{ border: 'none' }}
              placeholder="Title"
              color="brand.gray500"
              fontSize="16px"
              fontWeight={700}
              marginTop="0px"
              paddingX="0"
              name="description"
              value={entry.description}
              onChange={handleInput}
              disabled={isEntryPublished}
            />
          </VStack>
          {!isEntryPublished && (
            <VStack alignItems="flex-start" width="100%">
              <Text fontSize="14px" color="brand.neutral800">
                Linked project
              </Text>
              <Text>Where should Satoshi donations go to?</Text>
              <TextBox
                isDisabled
                value={`${projectData.project.name}@geyser.fund`}
              />
            </VStack>
          )}

          <VStack width="100%">
            {isEntryPublished ? (
              <>
                <ButtonComponent isFullWidth onClick={handlePublish}>
                  Share on Twitter
                </ButtonComponent>
                <ButtonComponent primary isFullWidth onClick={handleGotoPost}>
                  Go to Entry
                </ButtonComponent>
              </>
            ) : (
              <>
                <Box width={'full'}>
                  <Tooltip
                    label="Your project is not active yet so you cannot publish this Entry. But don’t worry your Entry will automatically be saved as a draft."
                    shouldWrapChildren
                    width={'full'}
                  >
                    <Button
                      isFullWidth
                      backgroundColor={'brand.primary'}
                      onClick={handlePublish}
                      isDisabled={Boolean(projectData.project.draft) || true}
                      width={'full'}
                    >
                      Publish
                    </Button>
                  </Tooltip>
                </Box>

                <Button
                  isFullWidth
                  backgroundColor={'brand.primary'}
                  onClick={() =>
                    history.push(
                      getPath('projectDashboard', projectData.project.name),
                    )
                  }
                >
                  Go to Project
                </Button>
              </>
            )}
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};
