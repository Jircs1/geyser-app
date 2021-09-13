import {extendTheme} from '@chakra-ui/react';
import { colors } from '../constants';
import { fonts } from '../constants/fonts';

export const theme = extendTheme({
	colors: {
		brand: {
			...colors,
		},
	},
	fonts: {
		heading: fonts.brand,
		body: fonts.brand,
		default: fonts.brand,
	},
	components: {
		Button: {
			// 1. We can update the base styles
			baseStyle: {
				fontWeight: 'normal', // Normally, it is "semibold"
			},
		},
	},
});

