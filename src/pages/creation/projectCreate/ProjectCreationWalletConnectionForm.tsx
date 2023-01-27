import { gql, useLazyQuery, useMutation } from '@apollo/client'
import {
  HStack,
  Image,
  InputGroup,
  InputRightElement,
  Link,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { AiOutlineSetting } from 'react-icons/ai'
import { BiRocket } from 'react-icons/bi'
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'

import AlbyPNG from '../../../assets/images/third-party-icons/alby@3x.png'
import BitNobPNG from '../../../assets/images/third-party-icons/bitnob@3x.png'
import WalletOfSatoshiPNG from '../../../assets/images/third-party-icons/wallet-of-satoshi@3x.png'
import VoltageLogoSmall from '../../../assets/voltage-logo-small.svg'
import {
  ButtonComponent,
  TextInputBox,
  UndecoratedLink,
} from '../../../components/ui'
import Loader from '../../../components/ui/Loader'
import {
  AlbyLightningAddressURL,
  BitNobURL,
  GeyserTermsAndConditionsURL,
  VoltageExplainerPageForGeyserURL,
  WalletOfSatoshiLightningAddressURL,
} from '../../../constants'
import { MUTATION_CREATE_WALLET } from '../../../graphql/mutations'
import { colors } from '../../../styles'
import {
  CreateWalletInput,
  FundingResourceType,
  LightningAddressVerifyResponse,
  LndNodeType,
  Project,
  ResourceInput,
} from '../../../types/generated/graphql'
import { toInt, useNotification, validateEmail } from '../../../utils'
import { NodeAdditionModal } from './components/NodeAdditionModal'
import { WalletConnectionOptionInfoBox } from './components/WalletConnectionOptionInfoBox'
import { TNodeInput } from './types'

type Props = {
  project: Project
  onProjectLaunchSelected: (_: CreateWalletInput) => void
  onSaveAsDraftSelected?: (_: CreateWalletInput) => void
  triggerWallet?: boolean
  setNodeInput?: React.Dispatch<React.SetStateAction<TNodeInput | undefined>>
}

export enum ConnectionOption {
  LIGHTNING_ADDRESS = 'LIGHTNING_ADDRESS',

  PERSONAL_NODE = 'PERSONAL_NODE',
}

export enum LNAddressEvaluationState {
  IDLE = 'IDLE',

  LOADING = 'LOADING',

  FAILED = 'FAILED',

  SUCCEEDED = 'SUCCEEDED',
}

type LightningAddressVerificationQueryVariables = {
  lightningAddress: string
}

type LightningAddressVerificationResponseData = {
  lightningAddressVerify: LightningAddressVerifyResponse
}

export const QUERY_LIGHTNING_ADDRESS_EVALUATION = gql`
  query LightningAddressVerify($lightningAddress: String) {
    lightningAddressVerify(lightningAddress: $lightningAddress) {
      reason
      valid
    }
  }
`

export const ProjectCreationWalletConnectionForm = ({
  project,
  onProjectLaunchSelected,
  onSaveAsDraftSelected,
  triggerWallet,
  setNodeInput: setNode,
}: Props) => {
  const { toast } = useNotification()

  const [nodeInput, setNodeInput] = useState<TNodeInput | undefined>(undefined)

  const [lightningAddressFormValue, setLightningAddressFormValue] = useState('')

  const [lightningAddressFormError, setLightningAddressFormError] = useState<
    string | null
  >(null)

  const [lnAddressEvaluationState, setLnAddressEvaluationState] =
    useState<LNAddressEvaluationState>(LNAddressEvaluationState.IDLE)

  const [connectionOption, setConnectionOption] = useState<string>('')

  const {
    isOpen: isWalletOpen,
    onClose: onWalletClose,
    onOpen: openWallet,
  } = useDisclosure()

  useEffect(() => {
    if (triggerWallet) {
      openWallet()
    }
  }, [triggerWallet])

  useEffect(() => {
    if (setNode) {
      setNode(nodeInput)
    }
  }, [nodeInput])

  const onSubmit = (value: TNodeInput) => {
    setNodeInput(value)
    if (setNode) {
      setNode(value)
    }
  }

  const [evaluateLightningAddress, { loading: isEvaluatingLightningAddress }] =
    useLazyQuery<
      LightningAddressVerificationResponseData,
      LightningAddressVerificationQueryVariables
    >(QUERY_LIGHTNING_ADDRESS_EVALUATION, {
      variables: {
        lightningAddress: lightningAddressFormValue,
      },
      onCompleted({ lightningAddressVerify: { valid } }) {
        if (Boolean(valid) === false) {
          setLnAddressEvaluationState(LNAddressEvaluationState.FAILED)
          setLightningAddressFormError(
            'We could not validate this as a working Lightning Address.',
          )
        } else {
          setLnAddressEvaluationState(LNAddressEvaluationState.SUCCEEDED)
        }
      },
    })

  const [createWallet, { loading: isCreateWalletLoading }] = useMutation(
    MUTATION_CREATE_WALLET,
  )

  const createWalletInput: CreateWalletInput | null = useMemo(() => {
    const resourceInput: ResourceInput = {
      resourceId: toInt(project.id),
      resourceType: FundingResourceType.Project,
    }

    if (connectionOption === ConnectionOption.PERSONAL_NODE) {
      if (Boolean(nodeInput) === false) {
        return null
      }

      return {
        lndConnectionDetailsInput: {
          macaroon: nodeInput!.invoiceMacaroon,
          tlsCertificate: nodeInput!.tlsCert,
          hostname: nodeInput!.hostname,
          grpcPort: nodeInput!.isVoltage
            ? 10009
            : nodeInput!.grpc
            ? parseInt(nodeInput!.grpc, 10)
            : 0,
          lndNodeType: nodeInput!.isVoltage
            ? LndNodeType.Voltage
            : LndNodeType.Custom,
          pubkey: nodeInput!.publicKey,
        },
        name: nodeInput!.name,
        resourceInput,
      }
    }

    if (connectionOption === ConnectionOption.LIGHTNING_ADDRESS) {
      return {
        lightningAddressConnectionDetailsInput: {
          lightningAddress: lightningAddressFormValue,
        },
        resourceInput,
      }
    }

    return null
  }, [project, nodeInput, connectionOption, lightningAddressFormValue])

  const isSubmitEnabled = useMemo(() => {
    if (createWalletInput === null) {
      return false
    }

    return (
      connectionOption === ConnectionOption.PERSONAL_NODE ||
      (connectionOption === ConnectionOption.LIGHTNING_ADDRESS &&
        Boolean(lightningAddressFormValue) === true)
    )
  }, [connectionOption, lightningAddressFormValue, createWalletInput])

  const validateLightningAddress = async () => {
    if (lightningAddressFormError === null) {
      await evaluateLightningAddress()
    }
  }

  const handleProjectLaunchSelected = async () => {
    await validateLightningAddress()

    try {
      await createWallet({ variables: { input: createWalletInput } })
      onProjectLaunchSelected(createWalletInput!)
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: `${error}`,
        status: 'error',
      })
    }
  }

  const validateLightningAddressFormat = async (lightningAddress: string) => {
    if (lightningAddress.length === 0) {
      setLightningAddressFormError(`Lightning Address can't be empty.`)
    } else if (lightningAddress.endsWith('@geyser.fund')) {
      setLightningAddressFormError(
        `Custom Lightning Addresses can't end with "@geyser.fund".`,
      )
    } else if (validateEmail(lightningAddress) === false) {
      setLightningAddressFormError(
        `Please use a valid email-formatted address for your Lightning Address.`,
      )
    } else {
      setLightningAddressFormError(null)
    }
  }

  const renderRightElementContent = () => {
    if (isEvaluatingLightningAddress) {
      return <Loader size="md"></Loader>
    }

    switch (lnAddressEvaluationState) {
      case LNAddressEvaluationState.IDLE:
        return null
      case LNAddressEvaluationState.LOADING:
        return <Loader size="md"></Loader>
      case LNAddressEvaluationState.FAILED:
        return <BsFillXCircleFill fill={colors.error} size="24px" />
      case LNAddressEvaluationState.SUCCEEDED:
        return <BsFillCheckCircleFill fill={colors.primary500} size="24px" />
      default:
        return null
    }
  }

  return (
    <>
      <VStack width="100%" alignItems="flex-start" spacing="40px">
        <RadioGroup onChange={setConnectionOption} value={connectionOption}>
          <VStack spacing={10}>
            <VStack width="100%" alignItems="flex-start" spacing={3}>
              <Radio size="lg" value={ConnectionOption.LIGHTNING_ADDRESS}>
                Lightning Address
              </Radio>

              {connectionOption === ConnectionOption.LIGHTNING_ADDRESS ? (
                <InputGroup size={'md'}>
                  <TextInputBox
                    name="lightning-address"
                    type={'email'}
                    placeholder={'satoshi@getalby.com'}
                    value={lightningAddressFormValue}
                    onChange={(event) => {
                      setLightningAddressFormValue(event.target.value)
                      validateLightningAddressFormat(event.target.value)
                    }}
                    onBlur={validateLightningAddress}
                    isInvalid={Boolean(lightningAddressFormError)}
                    focusBorderColor={colors.neutral200}
                    _valid={{
                      focusBorderColor: colors.primary500,
                    }}
                    error={lightningAddressFormError}
                  />
                  <InputRightElement>
                    {renderRightElementContent()}
                  </InputRightElement>
                </InputGroup>
              ) : null}

              <WalletConnectionOptionInfoBox
                primaryText="Easy setup process for beginners and Geyser charges a 2% operational fee per transaction."
                secondaryText={
                  <>
                    <Link
                      textDecoration="underline"
                      href="https://lightningaddress.com/"
                      isExternal
                    >
                      Lightning Addresses
                    </Link>{' '}
                    are like an email address, but for your Bitcoin. You can
                    receive your funds from both lightning and onchain
                    transactions. Get your own lightning access using these
                    recommended apps.
                  </>
                }
              >
                <HStack
                  width={'full'}
                  justifyContent={'flex-start'}
                  spacing={4}
                >
                  <UndecoratedLink isExternal href={AlbyLightningAddressURL}>
                    <HStack>
                      <Image src={AlbyPNG} height="24px" />
                      <Text fontSize={'12px'} fontWeight={'bold'}>
                        Alby
                      </Text>
                    </HStack>
                  </UndecoratedLink>

                  <Link isExternal href={WalletOfSatoshiLightningAddressURL}>
                    <Image src={WalletOfSatoshiPNG} height="24px" />
                  </Link>

                  <Link isExternal href={BitNobURL}>
                    <Image src={BitNobPNG} height="24px" />
                  </Link>
                </HStack>
              </WalletConnectionOptionInfoBox>
            </VStack>

            <VStack width="100%" alignItems="flex-start" spacing={3}>
              <Radio size="lg" value={ConnectionOption.PERSONAL_NODE}>
                Connect Your Node
              </Radio>

              {connectionOption === ConnectionOption.PERSONAL_NODE ? (
                <ButtonComponent w="full" onClick={openWallet}>
                  {' '}
                  <AiOutlineSetting
                    style={{ marginRight: '5px' }}
                    fontSize="20px"
                  />{' '}
                  Connect Your Node
                </ButtonComponent>
              ) : null}

              <WalletConnectionOptionInfoBox
                primaryText="Connect your node, manage your own liquidity, and Geyser won't charge any fees."
                secondaryText="Connect your Lightning node to receive incoming transactions directly. Beware that your node's liquidity remains your own responsibility. Don't have a node? You can get one on the cloud using Voltage."
              >
                <HStack width={'full'} justifyContent={'flex-start'}>
                  <Link isExternal href={VoltageExplainerPageForGeyserURL}>
                    <Image src={VoltageLogoSmall} />
                  </Link>
                </HStack>
              </WalletConnectionOptionInfoBox>
            </VStack>
          </VStack>
        </RadioGroup>

        <VStack width="100%" alignItems="flex-start">
          <ButtonComponent
            primary
            w="full"
            onClick={handleProjectLaunchSelected}
            isLoading={isCreateWalletLoading}
            disabled={
              isSubmitEnabled === false ||
              isEvaluatingLightningAddress ||
              Boolean(lightningAddressFormError)
            }
          >
            <>
              <BiRocket style={{ marginRight: '10px' }} />
              Launch Project
            </>
          </ButtonComponent>

          {onSaveAsDraftSelected && (
            <ButtonComponent
              w="full"
              onClick={() => onSaveAsDraftSelected(createWalletInput!)}
              disabled={isCreateWalletLoading || isEvaluatingLightningAddress}
            >
              Save As Draft
            </ButtonComponent>
          )}

          <HStack color={'brand.neutral600'} spacing={2} mt={2}>
            <Text>By continuing, I agree with Geyser&apos;s</Text>
            <Link
              href={GeyserTermsAndConditionsURL}
              isExternal
              textDecoration="underline"
            >
              Terms & Conditions
            </Link>
          </HStack>
        </VStack>
      </VStack>

      <NodeAdditionModal
        isOpen={isWalletOpen}
        onClose={onWalletClose}
        nodeInput={nodeInput}
        onSubmit={onSubmit}
      />
    </>
  )
}
