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
  
  ```

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

​```jsx
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

> **⚠️ v1 implementation below:**
>
> ```bash
> yarn add focus-visible
> ```
>
> > This will hide the focus indicator if the element receives focus    via the mouse, but it will still show up on keyboard focus.
>
> ```js
> // styles/global.js
> 
> import 'focus-visible/dist/focus-visible';
> 
> const styles = {
>   // props are used to access theme utils such as colormode
>   global: (props) => ({
>     '.js-focus-visible': {
>       /*
>     This will hide the focus indicator if the element receives focus via the mouse,
>     but it will still show up on keyboard focus.
>     */
>       outline: 'none',
>       boxShadow: 'none',
>     },
>     '*': {
>       border: 0,
>       margin: 0,
>       padding: 0,
>       boxSizing: 'content-box',
>       fontFeatureSettings: `'kern'`,
>       textRendering: 'optimizeLegibility',
>       WebkitFontSmoothing: 'antialiased',
>     },
>     '*::before, *::after': {
>       boxSizing: 'border-box',
>       wordWrap: 'break-word',
>     },
>     'input:focus': {
>       border: 'inherit',
>     },
>     'input:focus:invalid': {
>       backround: 'rgba(255, 224, 224, 1)',
>     },
>     'input:focus, input:focus:valid': {
>       backround: 'rgba(226, 250, 219, 1)',
>     },
>     'a:active, a:focus, a:visited': {
>       outline: 0,
>       border: 'none',
>       outlineStyle: 'none',
>       textDecoration: 'none',
>       boxShadow: '0 0 0 1px rgba(0, 0, 0, 0) !important',
>     },
>     'a:hover': {
>       textDecoration: 'none',
>     },
>     a: {
>       color: 'inherit',
>     },
>     html: {
>       minWidth: '360px',
>       scrollBehavior: 'smooth',
>     },
>     '#__next': {
>       display: 'flex',
>       flexDirection: 'column',
>       minHeight: '100vh',
>     },
>   }),
> };
> 
> export default styles;
> ```
>
>
> Next we simply need to import these styles into our theme:
>
> ```js
> // styles/theme.js
> 
> import { extendTheme } from '@chakra-ui/react';
> import styles from './global';
> 
> const theme = extendTheme({
>   fonts: {
>     body: `Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`,
>   },
>   fontWeights: {
>     normal: 400,
>     medium: 600,
>     bold: 700,
>   },
>   styles, // add custom global styles
> });
> 
> export default theme;
> ```
>







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





## Create custom icons

```bash
yarn add @chakra-ui/icons
```



```js
// styles/icons.js

export const LogoIcon = (props) => (
  <Icon viewBox="0 0 46 32" {...props}>
    <path
      d="M19.557.113C11.34.32 9.117 8.757 9.03 12.95c1.643-2.67 4.62-3.08 6.931-3.08 2.825.085 10.27.205 17.458 0C40.61 9.663 44.802 3.28 46 .112c-5.391-.085-18.228-.205-26.443 0zM14.422 14.234C3.332 14.234-.468 24.76.045 31.948c3.594-6.418 7.617-7.53 9.243-7.445h6.675c5.956 0 11.039-6.846 12.836-10.27H14.422z"
      // fill="currentColor"
    />
  </Icon>
);
```



Finally, we can use this logo throughout our application:

```jsx
// pages/index.js

import { Box, Button, Code, Heading, Text } from '@chakra-ui/react';
import { LogoIcon } from '../styles/icons';
import { useAuth } from '@/lib/auth';

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (
    <Box>
			
    	{/*...*/}

				{/* Custom Logo Icon Usage*/}
        <LogoIcon boxSize={12} fill="blue.200"/>

        {auth?.user ? (
          <Button onClick={(e) => auth.signout()}>Sign Out</Button>
        ) : (
          <Button onClick={(e) => auth.signinWithGitHub()}>Sign In</Button>
        )}
        
      </Box>

    	{/*...*/}

    </Box>
  );
};

export default Home;
```





### DashBoard UI

We'll be creating our dashboard ui components:

[/components/dashboard-shell.js](https://github.com/leerob/fastfeedback/blob/bfd960ec0ead6778025c4d8025fce9aa23602b50/components/DashboardShell.js) - [/components/free-plan-empty-state.js](https://github.com/leerob/fastfeedback/blob/bfd960ec0ead6778025c4d8025fce9aa23602b50/components/FreePlanEmptyState.js) - [/components/add-site-modal.js](https://github.com/leerob/fastfeedback/blob/bfd960ec0ead6778025c4d8025fce9aa23602b50/components/AddSiteModal.js)

[/components/empty-state.js](https://github.com/leerob/fastfeedback/blob/bfd960ec0ead6778025c4d8025fce9aa23602b50/components/EmptyState.js) - [/pages/dashboard.js](https://github.com/leerob/fastfeedback/blob/bfd960ec0ead6778025c4d8025fce9aa23602b50/pages/dashboard.js) 



⚠️ We've also ensure that the dashboard route is only accessible to logged in users: 



- Now once we login we can see our new layout:

  ![image-20201207234350606](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201207234350606.png)

- Now we can update our database with the functionality to create a new site for us:

  ```js
  // lib/db.js
  
  import firebase from './firebase';
  
  const firestore = firebase.firestore();
  
  export function createUser(uid, data) {
    return (
      firestore
        .collection('users') // db table name
        .doc(uid)
        .set({ uid, ...data }, { merge: true })
    );
  }
  
  // export a function to help create sites for us in the database
  export function createSite(data) {
    // sets a new table called sites
    return firestore.collection('sites').add(data);
  }
  ```

  

  We'll need a form-handling library - this will render a form in our modal allowing us to use our `createSite()` functionality:

  ```bash
  yarn add react-hook-form
  ```

  ![image-20201208000509688](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201208000509688.png)



#### Update Create Site Function:

```js
// components/add-site-modal.js

import { useAuth } from '@/lib/auth'; // used to add current user to newly created site
import { useToast } from '@chakra-ui/react' // used to send success response


const AddSiteModal = ({ children }) => {
  
	const auth = useAuth();
  const toast = useToast();

  /*...*/

  const onCreateSite = ({ name, url }) => {
  // ❌ const onCreateSite = (values) => {
  //    createSite(values);
    
     createSite({
       // setup initialized fields author and date:
       authorId: auth.user.id,
       createdAt: new Date().toISOString(),
      // add user input fields:
      name,
      url
     });
    
    // adds toast success response
     toast({
       title: 'Success!',
       description: "We've added your site.",
       status: 'success',
       duration: 5000,
       isClosable: true
     });
    
// used to refetch queries after updates
    mutate(
      // refetch the cached sites
      '/api/sites',
      async (data) => {
        // take the cached sites and manually update with newSite
        return { sites: [...data.sites, newSite] };
        // ☝️ This is client side only -- so a document id will not be available yet
      },
      false
    );
    
     onClose();
   };
  
  /*...*/
  
  
}

```

> With this in place we've now added our generated fields (author, and createdAt) along with the fields the user provides input for (site, url) to our database:
>
>
>    <div style="display: flex;">
>         <div>old entries:<img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201212131710011.png" /></div>
>         <div>new entries:<img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201212131629156.png" /></div>
>   </div>



Also before we move on we'll simply update our modal button styles:

```jsx
// components/add-site-modal.js

const AddSiteModal = ({ children }) => {


  /*...*/

    <Button
      onClick={onOpen}
      backgroundColor="gray.900"
      color="white"
      fontWeight="medium"
      _hover={{ bg: 'gray.700' }}
      _active={{
        bg: 'gray.800',
          transform: 'scale(0.95)'
      }}
      >
      {children}
    </Button>

  /*...*/
  
}
```



And now we can update our dashboard-shell component to render add site modal properly:

```jsx
// components/dashboard-shell.js

const DashboardShell = ({ children }) => {

	/*...*/
  <Flex justifyContent="space-between">
    <Heading mb={8}>My Sites</Heading>
    
    {/* ❌
    		<Button
            backgroundColor="gray.900"
            color="white"
            fontWeight="medium"
            _hover={{ bg: 'gray.700' }}
            _active={{
              bg: 'gray.800',
              transform: 'scale(0.95)',
            }}
          >
            + Add Site
          </Button> 
     */}
  	<AddSiteModal>+ Add Site</AddSiteModal>
    
  </Flex>
  /*...*/

}
```



And we'll need to make sure we're rendering children properly in our EmptyState component as well:

```jsx
// components/empty-state.js

 const EmptyState = () => (
   <DashboardShell>
       {/*...*/}

       {/* ❌ <AddSiteModal /> */}
       <AddSiteModal> + Add Site</AddSiteModal>

       {/*...*/}

   </DashboardShell>
 );
```





## Initialize Firebase Admin SDK

```bash
yarn add firebase-admin
```



- **Generate New Admin Private Key**

  ![firebase-admin](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/firebase-admin.gif)

  > **⚠️ NOTE:** the private key is generated as a JSON file and can be found in your downloads folder.



Just like how we implemented our client-side firebase config, we'll take similar steps to setup our server-side firebase admin:

```js
// lib/firebase-admin.js

import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
    // ⚠️ verify databaseURL / database name
    databaseURL: 'https://fast-feedback.firebaseio.com', 
  });
}

export default admin.firestore();
```

> **☝️ NOTE**: we'll need to add the following keys to our .env.local:
>
> ```bash
> FIREBASE_CLIENT_EMAIL=
> FIREBASE_PRIVATE_KEY=
> NEXT_PUBLIC_FIREBASE_PROJECT_ID=
> ```
>
> **⚠️ ALSO NOTE:** we needed to provide the `databaseURL` to configure the server-side admin, although because of recent changes to the backend firebase no longer provides this in their sdk config or in the generated private key json file, so we've inferred it based on the following from the firebase docs:
>
> ```js
> // https://firebase.google.com/docs/admin/setup?authuser=0#initialize-sdk
> 
> admin.initializeApp({
>   credential: admin.credential.applicationDefault(),
>   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
> });
> ```
>
> - So we simply just need our database_name to prefix the url with which we can find as such:
>
>   ![image-20201212145121158](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201212145121158.png)



Once we have the setup complete we can create our first API route to test our connection: [firestore docs](https://firebase.google.com/docs/firestore/query-data/get-data)

```js
// pages/api/sites.js

import db from '@/lib/firebase-admin';

export default async (_, res) => {
  // grab items from sites tab;e
  const snapshot = await db.collection('sites').get();
  const sites = [];

  snapshot.forEach((doc) => {
    // add each site to the table
    sites.push({ id: doc.id, ...doc.data() });
  });

  // return sites table as json
  res.status(200).json({ sites });
};
```

> If we've successfully set our admin sdk up, we should see our sites being output to the DOM:
>
> ![image-20201212160344676](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201212160344676.png)





### Create Table UI

We'll need some table elements to properly display our sites that we get back from the database:

```jsx
// components/table.js

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export const Th = (props) => (
  <Text
    as="th"
    textTransform="uppercase"
    fontSize="xs"
    color="gray.500"
    fontWeight="medium"
    px={4}
    {...props}
  />
);

export const Td = (props) => (
  <Box
    as="td"
    color="gray.900"
    p={4}
    borderBottom="1px solid"
    borderBottomColor="gray.100"
    {...props}
  />
);

export const Tr = (props) => (
  <Box
    as="tr"
    backgroundColor="gray.50"
    borderTopLeftRadius={8}
    borderTopRightRadius={8}
    borderBottom="1px solid"
    borderBottomColor="gray.200"
    height="40px"
    {...props}
  />
);

export const Table = (props) => {
  return (
    <Box
      as="table"
      textAlign="left"
      backgroundColor="white"
      ml={0}
      mr={0}
      borderRadius={8}
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      w="full"
      {...props}
    />
  );
};
```

> Styled table elements, including th, td, and tr



Next we can create a selecton for our expected data using the table components we've created:

```jsx
// components/site-table-skeleton.js

import React from 'react';
 import { Box, Skeleton } from '@chakra-ui/react';
 import { Table, Tr, Th, Td } from './table';

 const SkeletonRow = ({ width }) => (
   <Box as="tr">
     <Td>
       <Skeleton height="10px" w={width} my={4} />
     </Td>
     <Td>
       <Skeleton height="10px" w={width} my={4} />
     </Td>
     <Td>
       <Skeleton height="10px" w={width} my={4} />
     </Td>
     <Td>
       <Skeleton height="10px" w={width} my={4} />
     </Td>
   </Box>
 );

 const SiteTableSkeleton = () => {
   return (
     <Table>
       <thead>
         <Tr>
           <Th>Name</Th>
           <Th>Site Link</Th>
           <Th>Feedback Link</Th>
           <Th>Date Added</Th>
           <Th>{''}</Th>
         </Tr>
       </thead>
       <tbody>
         <SkeletonRow width="75px" />
         <SkeletonRow width="125px" />
         <SkeletonRow width="50px" />
         <SkeletonRow width="100px" />
         <SkeletonRow width="75px" />
       </tbody>
     </Table>
   );
 };

 export default SiteTableSkeleton;
```

> This allows us to render a skeleton based on the shape of the data we expect to come back from our database. This will replace our `Loading...` text and give a better user experience. 



Now that we have a skeleton in place for our data loading, let's get that rendered in our dashboard, first lets remove the dashboard wrapper from the Empty State and only apply it after we hae data loaded:

```jsx
// components/empty-state.js

 const EmptyState = () => (
  //❌  <DashboardShell>
  
     <Flex
       width="100%"
       backgroundColor="white"
       borderRadius="8px"
       p={16}
       justify="center"
       align="center"
       direction="column"
     >
       <Heading size="lg" mb={2}>
         You haven’t added any sites.
       </Heading>
       <Text mb={4}>Let’s get started.</Text>
       {/* ❌ <AddSiteModal /> */}
       <AddSiteModal> + Add Site</AddSiteModal>
     </Flex>

  //  </DashboardShell>
 );
```



Then lets make sure we render the skeleton and the DashboardShell wrapper properly:

```jsx
// pages/dashboard.js

const Dashboard = () => {
  const auth = useAuth();

  if (!auth.user) {
    // ❌ return 'Loading...';
    return <SiteTableSkeleton />;
  }

  return (
    <DashboardShell>
      <EmptyState />
    </DashboardShell>
  );
};
```



Lastly lets update our dashboard shell to make sure we're only showing the logout button when there is a user logged in:

```jsx
// components/DashboardShell.js

const DashboardShell = ({ children }) => {
  const { user, signout } = useAuth();

  return (
    <Box backgroundColor="gray.100" h="100vh">
			{/*...*/}

      <Flex justifyContent="center" alignItems="center">
        {user && (
          <Button variant="ghost" mr={2} onClick={() => signout()}>
            Log Out
          </Button>
        )}
        <Avatar size="sm" src={user?.photoUrl} />
      </Flex>
      
    	{/*...*/}
    </Box>
  );
};
```





Now we can see if this works we should see our skeleton appear right before our data gets loaded:

![table-skeleton2](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/table-skeleton2.gif)





Now that we have our table setup and a skeleton in place, we can work on our actual data-fetching:

```bash
yarn add swr
```

> https://github.com/vercel/swr



create our fetch helper: 

```js
// utils/fetcher.js

export default async (...args) => {
   const res = await fetch(...args);

   return res.json();
 };
```

> This is a default fetch function that helps implement swr -- and can be customized for your use-case



Use fetch helper to fetch data:

```jsx
// pages/dashboard.js

import useSWR from 'swr';

const Dashboard = () => {
  const auth = useAuth();
  const { data } = useSWR('/api/sites', fetcher);

  // ❌ if (!auth.user) {
  //   return <SiteTableSkeleton />;
  // }

  if (!data) {
    <DashboardShell>
      <EmptyState />
    </DashboardShell>;
  }

  return (
    <DashboardShell>
      {data?.sites ? <SiteTable sites={data.sites} /> : <EmptyState />}
    </DashboardShell>
  );
};
```

> Now our render state depends solely on whether or not we get related data back from the database -- we're no longer depending on the existence of a user in order to render our content. 



Next we'll need a table similar to our skeleton to handle our actual data:

```jsx
// components/site-table.js

import React from 'react';
import { Box, Link } from '@chakra-ui/react';
import { Table, Tr, Th, Td } from './table';
import { parseISO, format } from 'date-fns';

const SiteTable = ({ sites }) => {
  return (
    <Table>
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Site Link</Th>
          <Th>Feedback Link</Th>
          <Th>Date Added</Th>
          <Th>{''}</Th>
        </Tr>
      </thead>
      <tbody>
        {sites.map((site) => (
          <Box as="tr" key={site.url}>
            <Td fontWeight="medium">{site.name}</Td>
            <Td>{site.url}</Td>
            <Td>
              <Link>View Feedback</Link>
            </Td>
            <Td>{format(parseISO(site.createdAt), 'PPpp')}</Td>
          </Box>
        ))}
      </tbody>
    </Table>
  );
};

export default SiteTable;

```

With this in place we are now able to properly render our sites as a table:

![image-20201212180146861](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201212180146861.png)

