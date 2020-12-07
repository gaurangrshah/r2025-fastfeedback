import { ChakraProvider } from '@chakra-ui/react';
// import { Global, css } from '@emotion/react';

import { AuthProvider } from '@/lib/auth';
import theme from '@/styles/theme';

// ❌ removes global styles in favor of chakra v1 implementation
// const GlobalStyle = ({ children }) => {
//   return (
//     <>
//       <Global
//         styles={css`
//           html {
//             min-width: 360px;
//             scroll-behavior: smooth;
//           }

//           #__next {
//             display: flex;
//             flex-direction: column;
//             min-height: 100vh;
//           }
//         `}
//       />
//       {children}
//     </>
//   );
// };

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <AuthProvider>
        {/* <GlobalStyle /> */}
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
