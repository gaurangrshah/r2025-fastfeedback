import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { Global, css } from '@emotion/react';

import { AuthProvider } from '@/lib/auth';
import theme from '@/styles/theme';

const GlobalStyle = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          html {
            min-width: 360px;
            scroll-behavior: smooth;
          }

          #__next {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `}
      />
    </>
  );
};

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme} CSSReset>
      <AuthProvider>
        <GlobalStyle />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
