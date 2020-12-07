# React 2025

[repo](https://github.com/leerob/fastfeedback)

.

## Deploy template to vercel

Use the one-click deployment to deploy a brand new nextjs app to vercel.

[Deploy to Vercel](https://vercel.com/import/nextjs)

- once deployed you can visit your dashboard: [vercel dashboard](https://vercel.com/gshah2020/react2025)

- Current project deployed: [deployed website](https://react2025-snowy.vercel.app)

## Setup Local Development

When we deploy to vercel, a new repo will be generated under your github acct. You can find the link to the new repo, from the dashboard: [personal fastfeedback repo](https://github.com/gaurangrshah/r2025-fastfeedback)

```bash
git clone https://github.com/gaurangrshah/r2025-fastfeedback.git fastfeedback
```

```bash
cd fastfeedback && yarn
```

- start development server

```
yarn dev
```

We'll also be using prettier to help format our files in vscode:

```bash
touch prettierrc.js
```

```js
// prettierrc.js

module.exports = {
  arrowParens: 'always',
  singleQuote: true,
  tabWidth: 2,
  trailingComman: 'none',
};
```

## Setup Firebase

- create a firebase account if none exists: [firebase](https://console.firebase.google.com/u/0/?pli=1)
- create a new project: [firebase-console](https://console.firebase.google.com/u/0/?pli=1)

<pre><code>
<div style="display: flex;">
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205214001675.png"/></div>
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205214124524.png"/></div>
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205214413704.png"/></div>
  </div>
</code></pre>

- Select the web app icon to create a new app

<pre><code>
<div style="display: flex;">
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205214514999.png"/></div>
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205214702293.png"/></div>
        <div><img src=""/></div>
  </div>
</code></pre>

- make note of the credentials that are presented upon application creation:

![image-20201205215027558](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205215027558.png)

- create a new `.env.local` file in the root of your project to store our firebase credentials

  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  ```

  > **☝️ NOTE: ** we've prefied our environment variables with `NEXT_PUBLIC_` which tells next.js to expose these specific keys to our client side application.
  >
  > - ❗️ Any non-prefixed keys will only be available to our application on the server-side
  > - **❗️NOTE:** we also need to restart our development server in order to provide our local application with our environment variables.

## Setup Firebase Authentication

- setup firebase auth - click the "authentication" box in the console:

<pre><code>
  <div style="display: flex;">
          <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205222749228.png" /></div>
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205223233666.png" /></div>
        <div><img src="" /></div>
  </div>
</code></pre>

> **☝️ NOTE:** we'll need the callback url shown at the bottom to properly setup our github authentication.
>
> For now we'll leave the `ClientID` and `Client Secret` empty for now, we'll configure our OAuth application with github which will then provide us with the details we need to get our authentication setup and working.

### Setup Github OAuth Application

In order to use github as an authentication provider, we'll need to create a new OAuth Application that we can then use in this application.

[github oAuth settings](https://github.com/settings/applications/new)

<pre><code>
  <div style="display: flex;">
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205223506206.png" /></div>
        <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205223757429.png" /></div>
        <div><img src="" /></div>
  </div>
</code></pre>

> **⚠️ NOTE:** firebase may have a truncated url listed in its callback the url github requires should look like this: `https://fast-feedback-2868a.firebaseapp.com/__/auth/handler`

- Once we've generated our `client id` and `client secret` from github we can use those to configure the authentication settings in firebase:

  <pre><code>
    <div style="display: flex;">
          <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205224117665.png" /></div>
          <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205224234378.png" /></div>
          <div><img src="" /></div>
    </div>
  </code></pre>

  > Once we save we can see that now our github credentials are stored in firebase and github is enabled as an auth provider for our application.

### Setup Firebase Local Environment

- add firebase to our local dev environment:

  ```bash
  yarn add firebase
  ```

> **☝️ NOTE:** we'll be following some of the steps to configure github auth from the [firebase docs](https://firebase.google.com/docs/auth/web/github-auth)

- create a new folder called `/lib` and a new file called `firebase.js`

  ```bash
  mkdir lib && cd lib && touch firebase.js
  ```

- Now we can initialize our firebase application:

  ```js
  // lib/firebase.js

  import * as firebase from 'firebase/app';
  import 'firebase/auth';

  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  export default firebase;
  ```

- Next we can setup our authentication logic for firebase:

  ```bash
  touch lib/auth.js
  ```

- Now we can setup a custom hook that allows us to add authentication via firebase:

  ```js
  // lib/auth.js

  import React, { useState, useEffect, useContext, createContext } from 'react';
  import firebase from './firebase';

  const authContext = createContext();

  export function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }

  export const useAuth = () => {
    // custom hook used to consume authContext
    return useContext(authContext);
  };

  function useProvideAuth() {
    const [user, setUser] = useState(null);
  
  const handleUser = (rawUser) => {
      if (rawUser) {
        const user = formatUser(rawUser);
  
        setUser(user);
        return user;
      } else {
        setUser(false);
        return false;
      }
  };
  
    const signinWithGitHub = () => {
      return firebase
        .auth()
        .signInWithPopup(new firebase.auth.GithubAuthProvider())
        .then((response) => handleUser(response.user));
    };
  
  const signout = () => {
      return firebase
        .auth()
        .signOut()
        .then(() => handleUser(false));
    };
  
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

      return () => unsubscribe();
    }, []);

    return {
      user,
      signinWithGitHub,
      signout,
    };
  }
  
const formatUser = (user) => {
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      provider: user.providerData[0].providerId,
      photoUrl: user.photoURL,
    };
  };
  
  ```
  
  > **❗️NOTE:** currently we've setup our code for authenticating via GitHub, you can also take a look at a similar setup for authenticating via email and password if needed [refer to this commit](https://github.com/gaurangrshah/r2025-fastfeedback/commit/4f54d409791bf0c1f9a163a84fd998af81b0b635)

### Setup custom \_app with auth provider

```jsx
// pages/_app.js

import { AuthProvider } from '../lib/auth';

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;

```

> **💡** Next.js uses the `App` component to initialize pages. We've overridden it in order to wrap our application with the authentication provider.

Now we can use the consume authentication context from anywhere inside our application:

```jsx
// pages/index.js

import Head from 'next/head';
// import { auth } from 'firebase';
import { useAuth } from '../lib/auth';

const Home = () => {
   const auth = useAuth(); // import auth from our custom hook

  return (
    <div className="container">
      <Head>
        <title>Fast Feedback</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Fast Feedback</h1>

        <p className="description">
          Current user: <code>{auth.user ? auth.user.email : 'None'}</code>
        </p>

        {/* conditionally show authentication login button only if a user does not already exist */}
        {auth?.user ? (
          <button onClick={(e) => auth.signout()}>Sign Out</button>
        ) : (
          <button onClick={(e) => auth.signinWithGitHub()}>Sign In</button>
        )}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </div>
	)
}
```

![image-20201205233041200](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201205233041200.png)

### Add environment variables to vercel

![image-20201206170823747](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201206170823747.png)

> **❗️ NOTE: ** since we'll eventually be running a completely separate instance of firebase on local, production, and preview. We'll need to add our keys for each of the environments. We have already done so for our local environment with our `.env.local` file, but on vercel we've simply added the same keys for both our production and preview instances of our deployment.





### Saving Users to Database

- Create a database in firestore:

![create-db](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/create-db.gif)



Now that we have our database setup, we'll want to ensure that when a new user is created that user also gets saved to our new database. 

```js
// lib/firebase.js

import 'firebase/firestore';
```

> need to make sure we're including firestore in our imports. 





```js
// lib/db.js
import firebase from './firebase';

// initialize firestore
const firestore = firebase.firestore();

export function createUser(uid, data) {
  // creates new user and sets the database with new user
  return (
    firestore
      .collection('users') // db table name
      .doc(uid) // document === userId (uid)
      // add user id, and merge with data already present in database
      .set({ uid, ...data }, { merge: true })
  );
}
```



Then we can use this in our AuthProvider to ensure the user gets set in the database when they sign in:

```js
import { createUser } from './db';

function useProvideAuth() {

  /*... */
  
  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser);

      createUser(user.uid, user); // sets the user from context to firestore db
      
      setUser(user);
      return user;
    } else {
      setUser(false);
      return false;
    }
  };
  
  /*... */
  
}
```





So now we can test this setup, initially we should not see any tables in our database, but when our first user logs in that will create the a new table for our users, and a new document containing our user's information in that table:

![login-create-db](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/login-create-db.gif)	





## Setup Chakra-ui

```bash
yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion
```



### Setup custom chakra theme

```js
// styles/theme.js

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
});

export default theme;
```



In our theme we're using a custom google font, so we'll also need to import that in the head of our application's document. In order to do this we'll need to override the default document that next.js uses, the same way we did with our `_app.js` file earlier:

```jsx
// pages/document.js

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Fast Feedback</title>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

> most of the boiler plate here is just a copy of the [default document that nextjs uses](https://nextjs.org/docs/advanced-features/custom-document) under the hood, we've simply added our import of our custom google font at the top. 
>
> **☝️NOTE:** the document now contains our <Head/> element where all of our SEO magic happens, so we can remove this from all other pages such as the `index.js` page. 
>
> ```jsx
> // pages/index.js
> 
> const Home = () => {
>   const auth = useAuth(); // import auth from our custom hook
> 
>   return (
>     <div className="container">
>       {/* <Head>
>         <title>Fast Feedback</title>
>         <link rel="icon" href="/favicon.ico" />
>       </Head> */}
> 
> 		/*...*/
> 
>     </div>
>   );
> };
> 
> export default Home;
> ```







Lastly we can use chakra's `ChakraProvider` to wrap our application with our new custom theme, making our new font available throughout our application:

```jsx
// pages/_app.js

import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { AuthProvider } from '../lib/auth';
import theme from '../styles/theme';

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme} CSSReset>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;

```



Finally, let's tes our implementation of chakra by just updating the background color of our main container and using chakra's components for our main index page:

```jsx
// pages/index.js

import { Box, Button, Code, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '../lib/auth';

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (
    <Box className="container" bg="blue.200">
      <Box as="main">
        <Heading fontWeight="lg">Fast Feedback</Heading>

        <p>
          Current user: <Code>{auth.user ? auth.user.email : 'None'}</Code>
        </p>

        {/* conditionally show authentication login button only if a user does not already exist */}
        {auth?.user ? (
          <Button onClick={(e) => auth.signout()}>Sign Out</Button>
        ) : (
          <Button onClick={(e) => auth.signinWithGitHub()}>Sign In</Button>
        )}
      </Box>

      <Box as="footer">{/* <p>fast feedback</p> */}</Box>
    </Box>
  );
};

export default Home;
```



While we're at it let's also setup some of our initial Global Styles:

```jsx
// pages/_app.js

import { ChakraProvider, CSSReset } from '@chakra-ui/react';
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

```







## Setup Nextjs Absolute Imports

```json
// jsconfig.json

{
  "compilerOptions": {
    "baseUrl": "node_modules",
    "paths": { "@/*": ["../*"] }
  }
}

```

> **❗️ NOTE:** we've used a wildcard to ensure that all top level directories can be referenced using the `@` in our import syntax. This effectively does the same thing as below without having to be explicit.
>
> ```json
> {
>   "compilerOptions": {
>     "baseUrl": ".",
>     "paths": {
>       "@/components/*": ["components/*"],
>       "@/lib/*": ["lib/*"],
>       "@/styles/*": ["styles/*"]
>     }
>   }
> }
> ```
>
> We can then use this when we import components as:
>
> ```js
> // pages/index.js
> 
> import { useAuth } from '@/lib/auth';
> // import { useAuth } from '../lib/auth';
> 
> ```

