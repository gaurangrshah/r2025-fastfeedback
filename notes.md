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
  trailingComman: 'none'
}
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
> For now we'll leave the `ClientID` and `Client Secret`  empty for now, we'll configure our OAuth application with github which will then provide us with the details we need to get our authentication setup and working.







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
  
  import * as firebase from "firebase/app";
  import "firebase/auth";
  
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
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
  import firebase from './firebase'
  
  const authContext = createContext();
  
  export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }
  
  export const useAuth = () => {
    // custom hook used to consume authContext
    return useContext(authContext);
  };
  
  function useProvideAuth() {
    //
    const [user, setUser] = useState(null);
  
    const signinWithGithub = () => {
      return firebase
        .auth()
        .signInWithPopup(new firebase.auth.GithubAuthProvider())
        .then((res) => {
          setUser(response.user);
          return response.user;
        });
    };
  
    const signout = () => {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          setUser(false);
        });
    };
  
    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(false);
        }
      });
    }, []);
  
    return {
      user,
      signinWithGithub,
      signout,
    };
  }
  ```

  > **❗️NOTE:** currently we've setup our code for authenticating via GitHub, you can also take a look at a similar setup for authenticating via email and password if needed [refer to this commit](https://github.com/gaurangrshah/r2025-fastfeedback/commit/4f54d409791bf0c1f9a163a84fd998af81b0b635)



### Setup custom _app with auth provider

```js
// pages/_app.js


```

> **💡** Next.js uses the `App` component to initialize pages. We've overridden it in order to wrap our application with the authentication provider. 

