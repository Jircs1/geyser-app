import { Box, HStack, Image, ListItem, OrderedList, Text, UnorderedList, VStack } from '@chakra-ui/react';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { IdComponent } from '../../../components/molecules';
import { StatusBar } from '../../../components/ui';
import { IUser } from '../../../interfaces';

const useStyles = createUseStyles({
	containers: {
		spacing: '5px',
		alignItems: 'flex-start',
		marginTop: '20px',
		display: 'flex',
		'& img': {
			borderRadius: '5px',
		},
		'& a': {
			color: 'grey',
		},
	},
	texts: {
		textAlign: 'justify',
	},
});

const owner: IUser = {
	picture: 'https://pbs.twimg.com/profile_images/1479024887633264645/ka0Zbz-1_400x400.jpg',
	username: 'parman_the',
	fullName: 'King Johnson Apata',
	id: '',
	URL: '',
	twitter: false,
	badge: 'owner',
	amount: 0,
};

const ambassador: IUser = {
	picture: 'https://pbs.twimg.com/profile_images/1477647411963056128/7wd0aNSZ_400x400.jpg',
	username: 'ApataJ',
	fullName: 'Parman Bitcoin Private Key Whispere',
	id: '',
	URL: '',
	twitter: false,
	badge: 'ambassador',
	amount: 0,
};

export const King = () => {
	const classes = useStyles();
	return (
		<>

			<VStack spacing="5px" alignItems="left" marginTop="20px">
				<HStack spacing="10px" display="flex" flexWrap="wrap">
					<Text fontSize="16px">Project Owner:</Text>
					<IdComponent
						URL={owner.picture}
						username={owner.username}
						fullName={owner.username}
						twitter
						badge="owner"
					/>
				</HStack>
				<HStack spacing="10px" display="flex" flexWrap="wrap">
					<Text fontSize="16px">Ambassador:</Text>
					<IdComponent
						URL={'https://bit.ly/dan-abramov'}
						username={ambassador.username}
						fullName={ambassador.username}
						twitter
						badge="ambassador"
					/>

				</HStack>
			</VStack>
			<VStack className={classes.containers} alignItems="center !important" >
				<Box maxWidth={'500px'}>
					<Image src="/king_2.png" />

				</Box>
			</VStack>

			<VStack className={classes.containers}>
				<StatusBar variant="problem" message="Financial illiteracy among youths. " />
			</VStack>
			<VStack className={classes.containers}>
				<StatusBar variant="solution" message="Teaching financial literacy to the youths of Nigeria with Bitcoin and lightning." />
			</VStack>
			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'1.25em'}>
					The youths of Nigeria
				</Text>
				<Text className={classes.texts}>
					Nigeria is a country with double digit inflation, and yet youths are not aware of the pitfalls and dangers that this poses to their economic welfare. All in all, Nigerian youths don’t know how to create and maintain wealth, and poverty is raging in the country.  A solution is then needed to improve youths’ awareness on how to maintain and grow their wealth, through a conversation of money and Bitcoin.
				</Text>
				<Text className={classes.texts}>
					Bitcoin and the Lightning network are the key. They can teach the youths on how to earn and transfer without fees, and save without the value of their assets being debased, thanks to Bitcoin. Inspired by what is happening in El Salvador, my belief is that Nigeria can be among one of the first adopters of Bitcoin as money and a currency of enlightenment in the world.
				</Text>
				<Text className={classes.texts}>
					To do that we need to spread the word of Bitcoin to those who have most to gain from it, and the most to lose should they not learn about it. The youths of Nigeria represent the future of this country, only with them can we move our country outside of the cycle of poverty that exists.
				</Text>
			</VStack>
			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'1.25em'}>
					The Conference
				</Text>
				<Text className={classes.texts}>
					I believe the best way to teach the youths about Bitcoin is through face-to-face human contact. Many youths may not be technically savvy and understanding Bitcoin can be a true challenge. Therefore, I believe the best way of teaching about Bitcoin is through a conference where youths can come together and learn about Bitcoin in a positive environment.
				</Text>
				<Text className={classes.texts}>
					I’d like to create the first “Lagos Bitcoin Conference 2022”. My aim is to gather 300 youths under one roof to discuss Bitcoin, Lightning, and financial literacy. I would also love international speakers to be available physically or via online meeting, to talk to us and enlighten us more on Bitcoin.
				</Text>
			</VStack>
			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'16px'}>
					The agenda:
				</Text>
				<OrderedList>
					<ListItem>Bitcoin can act as a shield against the increasing inflation in Nigeria due to bad economy and government.</ListItem>
					<ListItem>How Bitcoin can act as both savings and investment</ListItem>
					<ListItem>How Bitcoin can break international transfers/ transactions</ListItem>
					<ListItem>How Bitcoin can create opportunities in Nigeria in this technology advancement age</ListItem>
					<ListItem>Bitcoin lightning in practice</ListItem>
					<ListItem>How Nigerian youths can adapt the El Salvador Bitcoin system</ListItem>
				</OrderedList>

			</VStack>

			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'16px'}>
					Speakers include:
				</Text>
				<UnorderedList>
					<ListItem>Arman the parman (armantheparman.com) </ListItem>
					<ListItem>Ray Youssef</ListItem>
				</UnorderedList>

			</VStack>

			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'16px'}>
					The funds received for this crowdfund will be used for:
				</Text>
				<UnorderedList>
					<ListItem>Booking an event hall (Isheri Ijegun Lagos)</ListItem>
					<ListItem>Creating and distributing flyers to youths</ListItem>
					<ListItem>Giveaway of Satoshis</ListItem>
					<ListItem>Live video coverage of the events</ListItem>
					<ListItem>Conference projectors</ListItem>
					<ListItem>Snacks and transportation for speakers to join conference</ListItem>
				</UnorderedList>

				<HStack spacing="30px">
					<Box>
						<Image src="/king_3.png" />
					</Box>
					<Box>
						<Image src="/king_4.png" />
					</Box>
					<Box>
						<Image src="/king_5.png" />
					</Box>
				</HStack>

			</VStack>
			<VStack className={classes.containers} >
				<Text fontWeight={600} fontSize={'1.25em'}>
					Who am I?
				</Text>
				<Text className={classes.texts}>
					I’m Apata Johnson. I’m a visionary, a dedicated entrepreneur, who loves technology. As a thinker, and someone who cherish technology I can say that Bitcoin is the next big thing, I have hope that with Bitcoin we change the way we view money in Nigeria and the world as a whole. And how, with Bitcoin, Nigeria will transform from an underdeveloped nation to a super developed nation. I’m just a freedom lover and I feel Nigeria needs bitcoin.
				</Text>
				<Text className={classes.texts}>
					I created Luminus Exchange to help educate Nigerians about Bitcoin. Read more about me and my work here:
				</Text>
				<UnorderedList>
					<ListItem><b>Twitter </b><a href="https://twitter.com/ApataJ" target={'_blank'} rel="noreferrer">https://twitter.com/ApataJ</a></ListItem>
					<ListItem><b>About Bitcoin </b><a href="https://drive.google.com/file/d/1IK80L-hNlh0RpSJCWQQFu3jG9r2W2U1C/view" target={'_blank'} rel="noreferrer">https://drive.google.com/file/d/1IK80L-hNlh0RpSJCWQQFu3jG9r2W2U1C/view</a></ListItem>

				</UnorderedList>
				<Box maxWidth={'400px'}>
					<Image src="/king_6.png" />
				</Box>
			</VStack>

		</>
	);
};