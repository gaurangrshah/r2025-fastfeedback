import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from '@/lib/auth';
import theme from '@/styles/theme';

function App({ Component, pageProps }) {
  // console.log(theme)
  return (
    <ChakraProvider theme={theme} resetCSS>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
