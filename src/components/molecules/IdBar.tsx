import { Box, Text } from '@chakra-ui/layout';
import { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';
import { Image } from '@chakra-ui/react';
import { LinkableAvatar, AnonymousAvatar } from '../ui';
import { IFundingTx, IProject, IAvatarMetadata } from '../../interfaces';
import { SatoshiIconTilted } from '../icons';
import { getDaysAgo, getRandomOrb } from '../../utils';
import { fonts } from '../../constants/fonts';
import FountainLogo from '../../assets/fountain-logo-black-small.png';
import BreezLogo from '../../assets/breez-logo.png';
import { commaFormatted } from '../../utils/helperFunctions';

interface IIdBar extends HTMLChakraProps<'div'> {
	fundingTx: IFundingTx
	project: IProject
}

export const IdBar = ({ fundingTx, project, ...rest }: IIdBar) => {
	const { funder, onChain, paidAt, source } = fundingTx;

	const getMetadata = (): IAvatarMetadata => {
		if (source) {
			if (source === 'Fountain') {
				const username = funder.user.username.replace('@', '');
				return {
					username,
					appName: 'Fountain.fm',
					image: FountainLogo,
					link: `https://fountain.fm/${username}`,
				};
			}

			if (source === 'Breez') {
				return {
					appName: source,
					image: BreezLogo,
					link: 'https://breez.technology/',
				};
			}
		}

		return {
			username: funder.user.username,
			image: funder.user.imageUrl || getRandomOrb(fundingTx.funder.id),
			link: `/profile/${funder.user.id}`,
		};
	};

	const anonymous = funder.user.username === 'anonymous';
	const timeAgo = getDaysAgo(paidAt) || '';
	const avatarMetadata = getMetadata();

	return (
		<Box
			padding="10px 25px"
			mt={2}
			width="95%"
			boxShadow="0px 0px 10px rgba(0, 0, 0, 0.08)"
			_hover={{boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)'}}
			borderRadius="12px"
			{...rest}
		><Box
				display="flex"
				justifyContent="space-between"
			>
				{
					anonymous
						? <AnonymousAvatar seed={fundingTx.funder.id} image={avatarMetadata.image}/>
						: <LinkableAvatar
							avatarMetadata={avatarMetadata}
						/>
				}

				<Box display="flex" alignItems="center">
					<SatoshiIconTilted scale={0.7}/><Text>{`${commaFormatted(fundingTx.amount)}`} </Text>
				</Box>
			</Box>
			<Box marginTop="6px" width="100%">
				{fundingTx.comment && <Text mb="6px" fontFamily={fonts.solway}>{fundingTx.comment}</Text>}
				{fundingTx.media && <Image src={`${fundingTx.media}`} alt="gif" width="100%" borderRadius="4px" />}
				<Text mt="6px" color="brand.textGrey" fontSize="10px" fontFamily={fonts.solway}>
					{timeAgo && `${onChain ? '⛓' : '⚡️'} ${timeAgo} ago `}
					{avatarMetadata.appName ? `from ${avatarMetadata.appName}` : source !== 'geyser' && `from ${source}`}
				</Text>
			</Box>

		</Box>
	);
};
