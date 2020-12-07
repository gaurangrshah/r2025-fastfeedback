import { extendTheme } from '@chakra-ui/react';
import styles from './global';

const theme = extendTheme({
  fonts: {
    body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
  styles, // add custom global styles
});

export default theme;
