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



> **⚠️ NOTE:**
>
> When setting the environment variable for the `FIREBASE_PRIVATE_KEY`, you must remove all new-line characters `/n` and replace them with an actual carriage return
>
> <div style="display: flex;">
>         <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201224004348774.png"/></div>
>         <div><img src="https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201224004515805.png"/></div>
>   </div>



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





## Creating Feedback Pages



Start by creating a new collection in firestore called 'feedback' and define the initial schema:

![feedback_collection](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/feedback_collection.gif)



Fill out our dummy example entry with valid data to help us populate this collection on the front-end:

![image-20201223002057796](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223002057796.png)

> Here we've populated the values using our own author info and an existing site created by the same author. 



Next we'll need to create a new database config to help us manage our server-side admin database content:

```js
// lib/db-admin.js

import firebase from './firebase-admin';

export async function getAllFeedback(siteid) {
  // get all feedback related to site, based on siteId
  const snapshot = await firebase.collection('feedback').where('siteId',  '==', siteId).get()
  const feedback = []

  snapshot.forEach((doc) => {
    feedback.push({id: doc.id, ...doc.data})
  })
  return feedback
}
```



Now we can setup an api route to test this implementation:

```js
// pages/api/feedback/[siteId].js

import { compareDesc, parseISO } from 'date-fns';

import firebase from './firebase-admin';

export async function getAllFeedback(siteId) {
  // get all feedback related to site, based on siteId
  const snapshot = await firebase.collection('feedback').where('siteId', '==', siteId).get();
  const feedback = [];

  snapshot.forEach((doc) => {
    // push feedback values to array
    feedback.push({ id: doc.id, ...doc.data() });
  });
  
  // sort feedback in descending order so that comments are rendered based on date
  feedback.sort((a,b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
  return feedback;
}
```



Now if we navigate to `http://localhost:3000/api/feedback/[siteid]`, we will see the related feedback for that particular site:

![image-20201223003955179](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223003955179.png)



Now that we know our api is working we can being to generate the page that will be used to display the information on the front-end for any given site:

```js
// pages/p/[siteId].js

export async function getStaticProps (context) {
  return {
    props: {
      // hard-coding initial feedback 
      initialFeedback: []
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          siteId: '8UmRJWvakHP8KKBjKwab',
        },
      },
    ],
    fallback: false
  };
}

const SiteFeedback = ({initialFeedback}) => {{
  return 'Hello World';

}

export default SiteFeedback
```

> We've scaffolded out our site feedback page, and we simply want to ensure that it prints 'Hello World' when we navigate to it with any siteId:
>
> ![image-20201223004650447](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223004650447.png)



> ⚠️  Since we want to avoid making direct server calls to our database from `getStaticProps()` or `getStaticPaths()` we'll abstract that logic back from our api route: `api/sites` into the server-side handler we created for our database:
>
> ```js
> // lib/db-admin.js
> 
> export async function getAllFeedback(siteId) {
> 	/*...*/
> }
> 
> 
> export async function getAllSites() {
>   // grab items from sites table
>   const snapshot = await firebase.collection('sites').get();
>   const sites = [];
> 
>   snapshot.forEach((doc) => {
>     // add each site to the array of sites to be returned to client-side
>     sites.push({ id: doc.id, ...doc.data() });
>   });
> 
>   return sites;
> }
> ```
>
> Now we can make sure that the api route uses the handler logic we've defined above:
>
> ```js
> // pages/api/sites.js
> 
> // import db from '@/lib/firebase-admin';
> import { getAllSites } from '@/lib/db-admin';
> 
> export default async (_, res) => {
> 
>   // ❌ abstracted to db-admin
>   // // grab items from sites tab;e
>   // const snapshot = await db.collection('sites').get();
>   // const sites = [];
> 
>   // snapshot.forEach((doc) => {
>   //   // add each site to the array of sites to be returned to client-side
>   //   sites.push({ id: doc.id, ...doc.data() });
>   // });
> 
>   const sites = await getAllSites() // use abstracted function instead
> 
>   // return sites table as json
>   res.status(200).json({ sites });
> };
> 
> ```





Now we can use the logic we just abstracted out to help us render any particular site on the front-end:

```jsx
// pages/p/[siteId].js

import { Box } from '@chakra-ui/react';

import { getAllFeedback, getAllSites } from '@/lib/db-admin';
import Feedback from '@/components/feedback';

export async function getStaticProps (context) {
  const siteId = context.params.siteId
  // get all feedback related to siteId
  const feedback = await getAllFeedback(siteId)
  return {
    props: {
      initialFeedback: feedback // pass feedback from firestore as props to page component
    },
  }
}

export async function getStaticPaths() {
  const sites = await getAllSites()
  const paths = sites.map(site => ({
    params: {
      siteId: site.id.toString()
    }
  }))

  return {
    paths,
    fallback: false
  };
}

const SiteFeedback = ({ initialFeedback }) => {
  return (
    <Box display="flex" flexDirection="column" width="full" maxWidth="700px" margin="0 auto">
      {initialFeedback.map((feedback) => {
        return <Feedback key={feedback.id} {...feedback} />;
      })}
    </Box>
  );
};


export default SiteFeedback
```





We've used the <Feedback /> component to help us render our feedback, which takes in all of the values from the database for each feedback item and helps us render them to the front-end:

```js
// components/feedback.js

import { Box, Heading, Text, Divider } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

const Feedback = ({ author, text, createdAt }) => {

  return (
    <Box borderRadius={4} maxWidth="700px" w="full">
      <Heading size="sm" as="h3" mb={0} color="gray.900" fontWeight="medium">
        {author}
      </Heading>
      <Text color="gray.500" mb={4} fontSize="xs">
        {format(parseISO(createdAt), 'PPpp')}
      </Text>
      <Text color="gray.800">{text}</Text>
      <Divider borderColor="gray.200" backgroundColor="gray.200" mt={8} mb={8} />
    </Box>
  );
};

export default Feedback;
```





With this in place we can see that we're able to render the data from the example feedback we created for this particular site:

![image-20201223012138991](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223012138991.png)





Next we'll want to create the logic we need to create a new comment for our feedback.

So we'll need to add a form the logic needed to save new comments to our database:

```jsx
// pages/p/[siteId].js

/*...*/


const SiteFeedback = ({ initialFeedback }) => {
  // stores feedback in local state
    const [allFeedback, setAllFeedback] = useState(initialFeedback)

    const auth = useAuth() // used to populate the author info when submitting form
    const router = useRouter() // used to populate siteId when submitting form

    const inputEl = useRef(null); // used to populate the input value when submitting form

    const onSubmit = (e) => {
      e.preventDefault();

      const newFeedback = {
        // create feedback object to set new comment to database as feedback
        author: auth.user.name,
        authorId: auth.user.uid,
        siteId: router.query.siteId,
        text: inputEl.current.value,
        createdAt: new Date().toISOString(),
        provider: auth.user.provider,
        status: 'pending',
      };

      setAllFeedback([newFeedback, ...allFeedback]); // add new comment to local state
      createFeedback(newFeedback); // update database
    };

  return (

    <Box display="flex" flexDirection="column" width="full" maxWidth="700px" margin="0 auto">
      {auth.user && (
        <Box as="form" onSubmit={onSubmit}>
          <FormControl my={8}>
            <FormLabel htmlFor="comment">Comment</FormLabel>
            <Input ref={inputEl} id="comment" placeholder="Leave a comment" />
            <Button mt={4} type="submit" fontWeight="medium">
              Add Comment
            </Button>
          </FormControl>
        </Box>
      )}
      {allFeedback.map((feedback) => {
        // renders comments from local state
        return <Feedback key={feedback.id} {...feedback} />;
      })}
    </Box>

  );
};
```



You'll notice we used a handler that will help us save new feedback to our database, we've defined that logic in our client side version of our database:

```js
// lib/db.js

/*...*/


export function createFeedback(data) {
  // sets new record for each user submitted feedback
  return firestore.collection('feedback').add(data);
}
```



Now with this in place we can attempt to add a new comment from our front-end, once saved it should be visible after a page refresh:

![image-20201223015412597](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223015412597.png)



### Add Error Handling

```js
// lib/db-admin.js

import { compareDesc, parseISO } from 'date-fns';

import firebase from './firebase-admin';

export async function getAllFeedback(siteId) {
  try {
    // get all feedback related to site, based on siteId
    const snapshot = await firebase.collection('feedback').where('siteId', '==', siteId).get();
    const feedback = [];

    snapshot.forEach((doc) => {
      // push feedback values to array
      feedback.push({ id: doc.id, ...doc.data() });
    });

    // sort feedback in descending order so that comments are rendered based on date
    feedback.sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));
    
    return { feedback };
    
  } catch (error) {
    
    return { error };
    
  }
}

export async function getAllSites() {
  try {
    // grab items from sites tab;e
    const snapshot = await firebase.collection('sites').get();
    const sites = [];

    snapshot.forEach((doc) => {
      // add each site to the array of sites to be returned to client-side
      sites.push({ id: doc.id, ...doc.data() });
    });

    return { sites };

  } catch (error) {
    
    return { error };
    
  }
}

```

> Here we've simply wrapped logic in a try-catch block, to help us surface any errors that are thrown. 
>
> We're also returning our values as an object { } and so we'll need to update how we handle this on the client side as well. 
>
> ```js
> // pages/p/[siteId].js
> 
> export async function getStaticProps(context) {
>   const siteId = context.params.siteId;
>   // get all feedback related to siteId
>   
> // now we're simply destructuring feedback because we've returned it as an obj
>   const { feedback } = await getAllFeedback(siteId);
>   
>   return {
>     props: {
>       initialFeedback: feedback, // pass feedback from firestore as props to page component
>     },
>   };
> }
> ```
>
> ```js
> // pages/p/[siteId].js
> 
> export async function getStaticPaths() {
> 	
>   // we're also destructuring sites because it was also returned as an object
>   const { sites } = await getAllSites();
>   
>   const paths = sites.map((site) => ({
>     params: {
>       siteId: site.id.toString(),
>     },
>   }));
> 
>   return {
>     paths,
>     fallback: false,
>   };
> }
> ```
>
>
> We'll also want to make this change anywhere in our api that we're using these same functions:
>
> ```js
> // pages/api/feedback/[siteId].js
> 
> import { getAllFeedback } from '@/lib/db-admin';
> 
> export default async(req, res) => {
>   const siteId = req.query.siteId;
>   
>   // ❌ const feedback = await getAllFeedback(siteId)
>   const { feedback, error } = await getAllFeedback(siteId)
> 
>   if(error) {
>     res.status(500).json({ error });
>   }
> 
>   res.status(200).json({ feedback });
> }
> 
> ```
>
> Here we've also added some error handling to ensure we're again surfacing any errors from our api call. 
>
>
> We can do the same thing for our other api call
>
>
> ```js
> // pages/api/sites.js
> 
> import { getAllSites } from '@/lib/db-admin';
> 
> export default async (_, res) => {
> 
> 
>   const {sites, error} = await getAllSites()
> 	if(error) {
> 		  res.status(500).json({ error });    
>   }
>   
>   res.status(200).json({ sites });
> };
> 
> ```
>
> We'll also have to update some of the dashboard logic to ensure we're still rendering our sites properly on the dashboard since we changed how they're being returned:
>
> ```jsx
> // pages/dashboard.js
> 
> const Dashboard = () => {
> 
> 	/*...*/
> 
>   return (
>     <DashboardShell>
>       {/* ❌ {data?.sites ? <SiteTable sites={data.sites} /> : <EmptyState />} */}
>       {data?.sites ? <SiteTable sites={data.sites.sites} /> : <EmptyState />}
>     </DashboardShell>
>   );
> };
> ```



Lastly we'll need to update how we render our links on our Sitetable:

```jsx
// components/site-table.js

const SiteTable = ({ sites }) => {
  return (
    
    {/*...*/}

        {sites.map((site) => (
          <Box as="tr" key={site.url}>
            <Td fontWeight="medium">{site.name}</Td>
            <Td>
              
              {/* ❌ <Link>View Feedback</Link> */}
              <Link href={site.url} isExternal>
                {site.url}
              </Link>
              
            </Td>
            <Td>
              // add link to view feedback:
              <NextLink href="/p/[siteId]" as={`/p/${site.id}`} passHref>
                <Link>View Feedback</Link>
              </NextLink>
              
            </Td>
            {/* used to format the date/time to a human readable string */}
            <Td>{format(parseISO(site.createdAt), 'PPpp')}</Td>
          </Box>
        ))}

    {/*...*/}

  );
};

export default SiteTable;

```



We can also add a new component to help us render these links to our feedback:

```jsx
// components/feedback-link.js

import { Flex, Link } from '@chakra-ui/react';

export default function FeedbackLink({ siteId }) {
  return (
    <Flex justifyContent="space-between" mb={8} width="full" mt={1}>
      <Link fontWeight="bold" fontSize="sm" href={`/p/${siteId}`}>
        Leave a comment →
      </Link>
      <Link fontSize="xs" color="blackAlpha.500" href="/">
        Powered by Fast Feedback
      </Link>
    </Flex>
  );
}
```





## Authenticated API Routes with Firebase

In this section our goal is to lock down our api routes allowing authenticated users access to ONLY their own sites, and locking access to any other site in the application. 



> Before getting started there are a few minor updates to the application:
>
> ```jsx
> // pages/index.js
> 
> 
> const Home = () => {
>   const auth = useAuth(); // import auth from our custom hook
> 
>   return (
>     <Flex
>       as="main"
>       direction="column"
>       mx="auto"
>       align="center"
>       justify="center"
>       flex={1}
>       maxW="300px"
>     >
>       <Head>
>         <title>Fast Feedback</title>
>       </Head>
>       <LogoIcon boxSize={12} fill="blue.200" />
>       <Text mb={4}>
>         <Text as="span" fontWeight="bold" display="inline">
>           Fast Feedback
>         </Text>
>         {' is being built as part of '}
>         <Link href="https://react2025.com" isExternal textDecoration="underline">
>           React 2025
>         </Link>
>         {`. It's the easiest way to add comments or reviews to your static site. It's still a work-in-progress, but you can try it out by logging in.`}
>       </Text>
> 
>       {auth?.user ? (
>         <>
>           <Flex justifyContent="space-between" w="full" mx="auto" mb={4}>
>             <Text>Current user:</Text>
>             <Code>{auth.user ? auth.user.email : 'None'}</Code>
>           </Flex>
>           <Flex justifyContent="space-between" w="full" mx="auto">
>             <Button as="a" size="sm" fontWeight="medium" href="/dashboard">
>               View Dashboard
>             </Button>
>             <Button size="sm" fontWeight="medium" onClick={(e) => auth.signout()}>
>               Sign Out
>             </Button>
>           </Flex>
>         </>
>       ) : (
>         <Button
>           variant="link"
>           size="sm"
>           mt={4}
>           size="sm"
>           fontWeight="medium"
>           onClick={(e) => auth.signinWithGitHub()}
>         >
>           Sign In
>         </Button>
>       )}
>     </Flex>
>   );
> };
> ```
>
> Here we've simply refactored for the purpose of adding some useful info about the application to the initial landing page. 



### Working with JWT's

Currently our rawUser includes a Json Web Token, we can take a look at it's contents by logging out our rawUser from `./lib/auth.js` and pasting. it into the playground at `www.jwt.io`

![image-20201223194153343](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201223194153343.png)

> As we can see above the token contains a bunch of information about our user profile, which is all encoded within it's "payload".  This allows us to use this information in order to securely communicate between the client-side of our application and our firestore server.



In order to use this information in our application we'll need to add the token to our formattedUser object that we return from `./lib/auth.js`

```js
// lib/auth.js


/*...*/


const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.ya, // include token with formatted user
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
```



We can then use this in the same file to help us extract the token from the user object and save only the user details to our database while we keep the token on the user object for use within our local client-side application:

```js
// lib/auth.js

/*...*/

  const handleUser = (rawUser) => {
    if (rawUser) {
      const user = formatUser(rawUser);

      // extract token from formatted user object:
      const {token, ...userWithoutToken} = user

      // sets the user from context wihtout token to firestore db
      createUser(user.uid, userWithoutToken);
      setUser(user); // user with token avaialble to client-side application
      return user;
    } else {
      setUser(false);
      return false;
    }
  };


/*...*/
```

> This allows us to make sure we're not saving the token to the database along with the user info, and only saving the necessary user info to the database while keeping the token available to us for authenticaton purposes within our client-side application. 



Using the token in our client side application to make our authenticated requests to grab our own site related to the current logged in user:

```js
// pages/dashboard.js

const Dashboard = () => {
 
  // ❌ const auth = useAuth();
  const { user } = useAuth();

  // use token to authenticate for our request
  const { data } = useSWR(user ? ['/api/sites', user.token] : null, fetcher);
 
/*...*/

  
}
```



Next we'll need to update the `fetcher` in order to ensure it handles our authentication logic for us:

```js
// utils/fetcher.js

export default async function fetcher(...args) {
  
  // ❌  const res = await fetch(...args);
  const res = await fetch(url, {
    method: 'GET',
    // include token from request with headers
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  });

  return res.json();
}

```




Now we'll need to update our firebase-admin.js:

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
    databaseURL: 'https://fast-feedback.firebaseio.com',
  });
}

const auth = admin.auth()
const firestore = admin.firestore()
// ❌ export default firestore 
export default { auth, firestore }

```



Now that we've changed how our request works, we'll need to ensure our api route knows to also authenticate users before executing the request:

```js

import { auth } from '@/lib/firebase-admin';
// ❌ import { getAllSites } from '@/lib/db-admin';
import { getUserSites } from '@/lib/db-admin';

// ❌ export default async (_, res) => {
//   const { sites, error } = await getUserSites();
//   if (error) {
//     res.status(500).json({ error });
//   }

//   res.status(200).json({ sites });
// };

export default async (req, res) => {
  try {
    // get user id from token on request headers
    const { uid } = await auth.verifyIdToken(req.headers.token);
    // get all related sites by userId
    const { sites } = await getUserSites(uid);

    res.status(200).json({ sites });
  } catch (error) {
    res.status(500).json({ error });
  }
};

```



We'll also need to update one other location where we use firebase-admin:

```js
// lib/db-admin.js

import { firebase } from './firebase-admin';
```

> just needed to make sure we're destructuring firebase rather than using it as a default import.





### Auto Redirect Logged-in Users

If a user is already logged in we'll want to automatically re-direct them to their own dashboard where they can view their sites. This is done by setting a cookie for logged in users, and using a script to handle the redirect in our `index.js` file.



First let's ensure we're setting the cookie for logged in users, and removing it for logged out users if a cookie already exists.

```bash
yarn add js-cookie
```



```js
// lib/auth.js

import cookie from 'js-cookie'; // https://tinyurl.com/8q2g5cw


function useProvideAuth() {
  const [user, setUser] = useState(null);

  const handleUser = (rawUser) => {
    if (rawUser) {

			/*...*/

      // set cookie to allow automatic logged-in redirect to dashboard
      cookie.set('fast-feedback-auth', true, {
				expires: 1, // expires in 1 day
      });

      return user;
      
    } else {
      // remove cookie if no logged in user (on logout)
      cookie.remove('fast-feedback-auth');
      
      setUser(false);
      return false;
    }
  };

	/*...*/

}
```



Now in our index file we can include a script using the <Head> tag from `next/head`

```jsx
// pages/index.js

const Home = () => {
  const auth = useAuth(); // import auth from our custom hook

  return (

    {/*...*/}

      <Head>
        <script
          
        // automatically redirects logged in users to dashboard
          dangerouslySetInnerHTML={{
            __html: `
              if (document.cookie && document.cookie.includes('fast-feedback-auth')) {
                window.location.href = "/dashboard"
              }
            `,

          }}
        />
        <title>Fast Feedback</title>
      </Head>
    
    {/*...*/}
}
```





### Implementing Incremental Static Regeneration

ISR allows us to take advantage of next.js's static regeneration to help us cache and retrieve data on the fly. The bulk of the work occurs under the hood, while we get fresh data as often as possible.  



We're going to apply this to our feedback pages:

```js
// pages/p/[siteId].js

export async function getStaticProps(context) {
  const siteId = context.params.siteId;
  // get all feedback related to siteId
  const { feedback } = await getAllFeedback(siteId);
  return {
    props: {
      initialFeedback: feedback, // pass feedback from firestore as props to page component
    },
    // allows for incremental static regeneration
    unstable_revalidate: 1 // -- update every second
  };
}
```

> **☝️ NOTE: ** this feature takes effect in production, in development, `getStaticProps()` and `getStaticPaths()` will fire on each reload, but in production, they will only fire when there is new data available, that data will then be cached. Finally, on the next reload it becomes available and rendered to all users. 



### Implement Vercel Preview 

In order for the vercel preview feature to work, we'll need to add the domain: `vercel.app` to our authorized domains in firebase

![image-20201224000800255](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201224000800255.png)





### Firebase Security Rules

https://firebase.google.com/docs/storage/security

> Google Cloud Storage lets you specify per file and per path authorization rules that live on our servers and determine access to the files in your app. For example, the default Storage Security Rules require Firebase Authentication in order to perform any `read` or `write` operations on all files:
>
> ```
> service firebase.storage {
>   match /b/{bucket}/o {
>     match /{allPaths=**} {
>       allow read, write: if request.auth != null;
>     }
>   }
> }
> ```
>
> You can edit these rules by selecting a Firebase app in [Firebase console](https://console.firebase.google.com/) and viewing the `Rules` tab of the Storage section.





## User Feeback page

The feedback page will be very similar to our dashboard page:

```jsx
// pages/feedback.js

import useSWR from 'swr';

import { useAuth } from '@/lib/auth';
import fetcher from '@/utils/fetcher';
import EmptyState from '@/components/empty-state';
import DashboardShell from '@/components/dashboard-shell';
import FeedbackTable from '@/components/feedback-table';
import SiteTableSkeleton from '@/components/site-table-skeleton';

const MyFeedback = () => {
  const { user } = useAuth();
  const { data } = useSWR(user ? ['/api/feedback', user.token] : null, fetcher);

  if (!data) {
    return (
      <DashboardShell>
        <SiteTableSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      {data?.feedback ? <FeedbackTable feedback={data.feedback} /> : <EmptyState />}
    </DashboardShell>
  );
};

export default MyFeedback;
```



We'll also need an api route for our feedback logic, which will also be similar to our sites api:

```js
// pages/api/feedback.js

import { auth } from '@/lib/firebase-admin';
import { getUserFeedback } from '@/lib/db-admin';

export default async (req, res) => {
  try {
    // get user id from token on request headers
    const { uid } = await auth.verifyIdToken(req.headers.token);
    // get all related feedback by userId
    const { feedback } = await getUserFeedback(uid);

    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error });
  }
};
```



We'll also need a function to help us get all of the user's feedback:

```js
// lib/db-admin.js

export async function getUserFeedback(userId) {
    const snapshot = await db.collection('feedback').where('authorId', '==', uid).get();

    const feedback = [];

    snapshot.forEach((doc) => {
      feedback.push({ id: doc.id, ...doc.data() });
    });

    return { feedback };
}
```



With this in place our feedback route, should be able to be rendered:

![image-20201225021034642](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201225021034642.png)

> **☝️ NOTE: ** currently we're displaying the author's name instead of the site name, this is because we're not actually saving the site name in our data model yet, we'll need to make that update and ensure we're saving that information when a new site is added:
>
> ```jsx
> // pages/p/[siteId].js
> 
> const SiteFeedback = ({ initialFeedback }) => {
> 
>   	/*...*/
> 
>       const newFeedback = {
>         // create feedback object to set new comment to database as feedback
>         author: auth.user.name,
>         authorId: auth.user.uid,
>         siteId: router.query.siteId,
>         text: inputEl.current.value,
>         createdAt: new Date().toISOString(),
>         provider: auth.user.provider,
>         status: 'pending',
>       };
> 
>     	/*...*/
>       
>     };
> 
>   return (
> 
>     /*...*/
>     
>   );
> };
> 
> export default SiteFeedback;
> ```
>
> 



### Refactor Table Headers

We're re-using our dashboard shell component here, and will need to modify it to allow us to change it's header from "sites" to "feedback" to do this we'll be refactoring some of it:

> ```jsx
> // components/dashboard-shell.js
> 
> 
> import { useAuth } from '@/lib/auth';
> 
> 
> const DashboardShell = ({ children }) => {
>   const { user, signout } = useAuth();
> 
>   return (
>     <Box backgroundColor="gray.100" h="100vh">
>       <Flex backgroundColor="white" mb={16} w="full">
>         <Flex
>           alignItems="center"
>           justifyContent="space-between"
>           pt={4}
>           pb={4}
>           maxW="1250px"
>           margin="0 auto"
>           w="full"
>           px={8}
>           h="70px"
>         >
>           <Flex align="center">
>             <NextLink href="/" passHref>
>               <Link>
>                 <LogoIcon name="logo" boxSize={8} mr={8} />
>               </Link>
>             </NextLink>
> 
>             {/* ❌ <Link mr={4}>Sites</Link>
>             <Link>Feedback</Link> */}
> 
>             <NextLink href="/dashboard" passHref>
>               <Link mr={4}>Sites</Link>
>             </NextLink>
>             <NextLink href="/feedback" passHref>
>               <Link>Feedback</Link>
>             </NextLink>
> 
>           </Flex>
>           <Flex justifyContent="center" alignItems="center">
>             {user && (
>               <Button variant="ghost" mr={2} onClick={() => signout()}>
>                 Log Out
>               </Button>
>             )}
>             <Avatar size="sm" src={user?.photoUrl} />
>           </Flex>
>         </Flex>
>       </Flex>
>       <Flex margin="0 auto" direction="column" maxW="1250px" px={8}>
>         {/* ❌ <Breadcrumb>
>           <BreadcrumbItem>
>             <BreadcrumbLink>Sites</BreadcrumbLink>
>           </BreadcrumbItem>
>         </Breadcrumb>
>         <Flex justifyContent="space-between">
>           <Heading mb={8}>My Sites</Heading>
>           <AddSiteModal>+ Add Site</AddSiteModal>
>         </Flex> */}
>         {children}
>       </Flex>
>     </Box>
>   );
> };
> 
> export default DashboardShell;
> ```
>
> 
>
> we've extracted the breadcrumbs and the table header into it's own component:
>
>
> ```jsx
> // components/site-table-header.js
> 
> import React from 'react';
> import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Flex } from '@chakra-ui/react';
> 
> const SiteTableHeader = () => {
>   return (
>     <>
>       <Breadcrumb>
>         <BreadcrumbItem>
>           <BreadcrumbLink>Sites</BreadcrumbLink>
>         </BreadcrumbItem>
>       </Breadcrumb>
>       <Flex justifyContent="space-between">
>         <Heading mb={8}>My Sites</Heading>
>         <AddSiteModal>+ Add Site</AddSiteModal>
>       </Flex>
>     </>
>   );
> };
> 
> export default SiteTableHeader;
> 
> ```
>
> 
>
> And we're simply rendering the extracted table-header component on our dashboard:
>
> ```jsx
> // pages/dashboard.js
> 
> import SiteTableHeader from '../components/site-table-header';
> 
> const Dashboard = () => {
> 
> 	/*...*/
> 
>   if (!data) {
>     <DashboardShell>
>       
>       <SiteTableHeader /> 	{/* add extracted table-header */}
>       
>       <SiteTableSkeleton />
>     </DashboardShell>;
>   }
> 
>   return (
>     <DashboardShell>
>       <SiteTableHeader /> {/* add extracted table-header */}
>       
>       {data?.sites ? <SiteTable sites={data.sites} /> : <EmptyState />}
>     </DashboardShell>
>   );
> };
> ```
>
> 
>
> While we're refactoring we'll also went to make a small asthetic change to our site-table component where we render the feedback link, just to make it more pronounced as a link:
>
> ```jsx
> const SiteTable = ({ sites }) => {
>   return (
>     <Table>
>       
>       {/*...*/}
>       
>       <tbody>
>         {sites.map((site) => (
>           <Box as="tr" key={site.url}>
> 
>             {/*...*/}
>             
>             <Td>
>               <NextLink href="/p/[siteId]" as={`/p/${site.id}`} passHref>
> 
>                 {/* ❌ <Link>View Feedback</Link> */}
>                 <Link color="blue.500" fontWeight="medium">
>                   View Feedback
>                 </Link>
>               
>               </NextLink>
>             </Td>
> 
>             {/*...*/}
> 
>           </Box>
>         ))}
>       </tbody>
>     </Table>
>   );
> };
> ```
>
> 



Now that we have this in place we can do the same thing with our a similar header for the feedback page route:

```jsx
// components/feedback-table-header.js

import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Flex } from '@chakra-ui/react';

const FeedbackTableHeader = () => (
  <>
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink>Feedback</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
    <Flex justifyContent="space-between">
      <Heading mb={8}>My Feedback</Heading>
    </Flex>
  </>
);

export default FeedbackTableHeader;
```



And we'll also do something similar for our feedback skeleton component rather than re-using our site-skeleton:

```jsx
// components/feedback-table-skeleton.js

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

const FeedbackTableSkeleton = () => {
  return (
    <Table>
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Feedback</Th>
          <Th>Route</Th>
          <Th>Visible</Th>
          <Th width="50px">{''}</Th>
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

export default FeedbackTableSkeleton;
```





We'll also be creating a feedback-table similar to our site-table component:

```jsx
// components/feedback-table.js

import { Code, Box } from '@chakra-ui/react';
import { Table, Tr, Th, Td } from './table';
import DeleteFeedbackButton from './delete-feedback-button';

const FeedbackTable = (props) => {
  return (
    <Table>
      <thead>
        <Tr>
          <Th>Name</Th>
          <Th>Feedback</Th>
          <Th>Route</Th>
          <Th>Visible</Th>
          <Th width="50px">{''}</Th>
        </Tr>
      </thead>
      <tbody>
        {props.feedback.map((feedback) => (
          <Box as="tr" key={feedback.id}>
            <Td fontWeight="medium">{feedback.author}</Td>
            <Td>{feedback.text}</Td>
            <Td>
              <Code>{`/`}</Code>
            </Td>
            
            {/* Adds switch element to toggle visiblity */}
            <Td><Switch colorScheme="green" defaultIsChecked={feedback.status === 'active'}/></Td>
            
            {/* ❌ <Td>{'Remove'}</Td> */}
            
            <DeleteFeedbackButton feedbackId={feedback.id} />
            
          </Box>
        ))}
      </tbody>
    </Table>
  );
};

export default FeedbackTable;
```

> **☝️ NOTE: ** we've manually changed the status of a few feedback comments to 'active' just to ensure this logic works - in our firestore database 
>
> ![image-20201225024144594](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201225024144594.png)



We're using a delete feedback button, so we'll need to create a button for this to handle the delete logic, and the associated functions for it:

```jsx
// components/delete-feedback-button.js

import React, { useState, useRef } from 'react';
import { mutate } from 'swr';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { deleteFeedback } from '@/lib/db';
import { useAuth } from '@/lib/auth';

const DeleteFeedbackButton = ({ feedbackId }) => {
  const [isOpen, setIsOpen] = useState();
  const cancelRef = useRef();
  const auth = useAuth();

  const onClose = () => setIsOpen(false);
  const onDelete = () => {
    deleteFeedback(feedbackId);
    mutate(
      ['/api/feedback', auth.user.token],
      async (data) => {
        return {
    // manually remove the deleted feedback from client-side while updating cache
          feedback: data.feedback.filter((feedback) => feedback.id !== feedbackId),
        };
      },
      false
    );
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label="Delete feedback"
        icon={<DeleteIcon/>}
        variant="ghost"
        onClick={() => setIsOpen(true)}
      />
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Feedback
          </AlertDialogHeader>
          <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onDelete} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteFeedbackButton;
```



Now we'll need to make sure we have a function that handles the delete from our client-side firestore database:

```js
// lib/db.js

export function deleteFeedback(id) {
  // allows user to remove feedback
  return firestore.collection('feedback').doc(id).delete();
}
```



Now we can use the newly created table-header and table-skeleton components for our feedback page:

```jsx
// pages/feedback.js

import FeedbackTable from '@/components/feedback-table';
import FeedbackTableHeader from '@/components/feedback-table-header';
import FeedbackTableSkeleton from '@/components/feedback-table-skeleton';

const MyFeedback = () => {
  const { user } = useAuth();
  const { data } = useSWR(user ? ['/api/feedback', user.token] : null, fetcher);

  if (!data) {
    return (
      <DashboardShell>
        <FeedbackTableHeader />
        <FeedbackTableSkeleton />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <FeedbackTableHeader />
      {data?.feedback ? <FeedbackTable feedback={data.feedback} /> : <EmptyState />}
    </DashboardShell>
  );
};

export default MyFeedback;
```



With this all in place we have the basic structure and logic for our feeback table:

![image-20201225031556158](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201225031556158.png)





### Sign-in with Google

we currently have the ability to login via GitHub, and we'll want to add the option to use google as well:

```js
// lib/auth.js

function useProvideAuth() {

	/*...*/
  
  const signinWithGoogle = () => {
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => handleUser(response.user));
  };

  /*...*/
  
    return {
    user,
    signinWithGitHub,
    signinWithGoogle, // add google signin to return statement
    signout,
  };
}


```



```jsx
// pages/index.js

import { LogoIcon, GoogleSigninButton, GithubSigninButton } from '../styles/icons';
const Home = () => {
	{/*...*/}

        <Stack>
          <Button
            size="lg"
            mt={4}
            fontWeight="medium"
            colorScheme="gray"
            color="gray.900"
            variant="outline"
            leftIcon={<GoogleSigninButton />}
            onClick={(e) => auth.signinWithGitHub()}
          >
            Sign In
          </Button>
          <Button
            size="lg"
            mt={4}
            fontWeight="medium"
            colorScheme="gray"
            color="gray.900"
            variant="outline"
            leftIcon={<GithubSigninButton />}
            onClick={(e) => auth.signinWithGoogle()}
          >
            Sign In
          </Button>
        </Stack>
  
  {/*...*/}
}
```



We're using new signin buttons for both google and github to give the user a choice, and we can implement the buttons like this:

```jsx
// styles/icons.js

export const GoogleSigninButton = (props) => {
  return (
    <Icon viewBox="0 0 533.5 544.3" {...props}>
      <path
        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
        fill="#4285f4"
      />
      <path
        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
        fill="#34a853"
      />
      <path
        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
        fill="#fbbc04"
      />
      <path
        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
        fill="#ea4335"
      />
    </Icon>
  );
};


export const GithubSigninButton = (props) => {
  return (
    <Icon
      viewBox="0 0 533.5 544.3"
      fill="none"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"{...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="#000"/>
  </Icon>
  )
};

```



We'll also need to add the new authentication provider to our backend via firebase:

![image-20201225033830278](https://cdn.jsdelivr.net/gh/gaurangrshah/_shots@master/scrnshots/image-20201225033830278.png)





## Squashing Bugs

### Handle Redirect After Sigin / Signout

```js
// lib/auth.js

import Router from 'next/router';

function useProvideAuth() {

	/*...*/
  
    const signinWithGitHub = () => {

    Router.push('/dashboard'); // redirect user on authentication

    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => handleUser(response.user));
  };

  const signinWithGoogle = () => {

    Router.push('/dashboard'); // redirect user on authentication

    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((response) => handleUser(response.user));
  };
  
  const signout = () => {

    Router.push('/'); // redirect user on authentication

    return firebase
      .auth()
      .signOut()
      .then(() => handleUser(false));
  };
  
  /*...*/

}
```





### Display Site Id on Feedback Table

Currently as we noted in the previous module, we are displaying the authorId, instead of the siteId, because our data model does not yet support the siteid value. We'll add support for this, and ensure that it is being set when a new site is created:

```js
// lib/db.js

export function createSite(data) {
  // sets a new table called sites
  // ❌ return firestore.collection('sites').add(data);
		
    const site = firestore.collection('sites').doc(); // reference to new site
    site.set(data); // set data from @args to properly facilitate optimistic-ui

    return site;
}
```

> Instead of directly returning the operation to add a new site, we first create a reference, that reference to our new site, which will contain the newly generated id for the site we just added. We can use this to update our cache on the client side allowing for our optimistic-ui to function as expected and maintaing it's linking ability. 



```jsx
// components/add-site-modal.js

  const onCreateSite = ({ name, url }) => {

		/*...*/
    
        // ❌ createSite({
    //   // setup initialized fields author and date:
    //   authorId: auth.user.uid,
    //   createdAt: new Date().toISOString(),
    //   // add user input fields:
    //   name,
    //   url,
    // });

    // destructure the new created siteId to use for optimistic-ui
    const { id } = createSite(newSite)
    
    /*...*/

    mutate(
      // refetch the cached sites
      ['/api/sites', auth.user.token],
      
      
      // ❌ async (data) => {
      //   return { sites: [...data.sites, newSite] };
      // },
      
			async (data) => (
        // take the cached sites and manually update with newSite and add siteId
        { sites: [...data.sites, {id, ...newSite}] }
      ),
     
      false
    );
    
    /*...*/
  }
```

> **☝️ NOTE: ** we've grabbed the id from the newly created site, to allow us to update our cache which means our UI will function as we expect so we can still link to each individual feedback page since we now have a reference to the newly created site's id.
>
>
> Now after a new site is created we can click `View Feedback` and we'll be taken to the feedback page for the correct site since we have the id already available, we don't have to wait for the caching to occur on refresh. 

