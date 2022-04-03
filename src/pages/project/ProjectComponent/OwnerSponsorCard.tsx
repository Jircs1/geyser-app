import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Box, HStack, IconButton, Link, Text, useDisclosure, VStack, Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';
import { AddAmbassador, AddSponsor } from '../../../components/molecules';
import { Card, ImageBar, StatusBar } from '../../../components/ui';
import { IProjectImage, IProjectSponsor, IUser } from '../../../interfaces';
import { isMobileMode } from '../../../utils';
import { useStyles } from './styles';

interface IOwnerSponsorCard {
    owner: IUser
    ambassadors: IUser[]
    sponsors: IProjectSponsor[]
    ownerIntro: string
	problem: string
    idea: string
	images: IProjectImage[]
}

export const OwnerSponsorCard = ({owner, ambassadors, sponsors, ownerIntro, images, problem, idea}: IOwnerSponsorCard) => {
	const isMobile = isMobileMode();
	const classes = useStyles({ isMobile });

	const {isOpen: ambassadorOpen, onOpen: onAmbassadorOpen, onClose: onAmbassadorClose} = useDisclosure();
	const {isOpen: sponsorOpen, onOpen: onSponsorOpen, onClose: onSponsorClose} = useDisclosure();

	const handleScroll = () => {
		const element = document.getElementById('aboutMe');

		if (element) {
			const scrollElement = document.getElementById('project-scoll-container');
			if (scrollElement) {
				const scrollValue = element.offsetTop - scrollElement.offsetTop;
				scrollElement?.scrollTo({ top: scrollValue, behavior: 'smooth' });
			}
		}
	};

	return (
		<>
			<Card className={classes.cardContainer}>
				<VStack spacing="15px" alignItems="flex-start">
					<VStack spacing="10px" >
						<ImageBar images={images} />
						<StatusBar variant="problem" message={problem} />
						<StatusBar variant="idea" message={idea} />
					</VStack>
					<Box>
						<Text fontSize="10px" color="brand.textGrey">PROJECT OWNER</Text>
						<HStack spacing="30px" alignItems="flex-start">
							<Link href={`https://twitter.com/${owner.username}`} isExternal>
								<Avatar width="75px" height="75px" name={owner.username} src={owner.imageUrl} />
							</Link>
							<VStack justifyContent="space-between" alignItems="flex-start">
								<Link href={`https://twitter.com/${owner.username}`} isExternal>
									<Text fontSize="18px">
										{owner.fullName}
									</Text>
								</Link>
								<Text fontSize="12px" >
									{isMobile ? ownerIntro.slice(0, 84) : ownerIntro.slice(0, 180) }
									<span className={classes.readmore} onClick={handleScroll}>...read more</span>
								</Text>
							</VStack>
						</HStack>
					</Box>
					<VStack spacing="10px" alignItems="flex-start" >
						<Text fontSize="10px" color="brand.textGrey">AMBASSADORS</Text>
						<Wrap>
							{
								ambassadors.map((ambassador: IUser) => (
									<WrapItem key={ambassador.username} display="inline-block">
										<Link href={`https://twitter.com/${ambassador.username}`} isExternal >
											<HStack className={classes.amabassadorBlock} spacing="5px">
												<Avatar width="24px" height="24px" name={ambassador.username} src={ambassador.imageUrl} />
												<Text fontSize="14px" >
													{`@${ambassador.username}`}
												</Text>
											</HStack>
										</Link>
									</WrapItem>
								))
							}
							<WrapItem>
								<IconButton aria-label="add-ambassador" icon={<AddIcon />} onClick={onAmbassadorOpen} />
							</WrapItem>
						</Wrap>

					</VStack>
					<VStack spacing="10px" alignItems="flex-start">
						<Text fontSize="10px" color="brand.textGrey">SPONSORS</Text>
						<Wrap >
							{
								sponsors.map((sponsor: IProjectSponsor) => (
									<WrapItem key={sponsor.user.username} display="inline-block">
										<Link href={`https://twitter.com/${sponsor.user.username}`} isExternal>
											<HStack spacing="5px" className={classes.amabassadorBlock}>
												<Avatar width="24px" height="24px" name={sponsor.user.username} src={sponsor.user.imageUrl} />
												<Text fontSize="14px">
													{`@${sponsor.user.username}`}
												</Text>
											</HStack>
										</Link>
									</WrapItem>
								))
							}
							<WrapItem>
								<IconButton aria-label="add-sponsor" icon={<AddIcon />} onClick={onSponsorOpen} />
							</WrapItem>
						</Wrap>

					</VStack>
				</VStack>

			</Card>
			<AddAmbassador isOpen={ambassadorOpen} onClose={onAmbassadorClose}/>
			<AddSponsor isOpen={sponsorOpen} onClose={onSponsorClose}/>
		</>
	);
};