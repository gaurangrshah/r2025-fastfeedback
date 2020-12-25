import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import cookie from 'js-cookie'; // https://tinyurl.com/8q2g5cw

import firebase from './firebase';
import { createUser } from './db';

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

      // extract token from formatted user object:
      const { token, ...userWithoutToken } = user;

      // sets the user from context without token to firestore db
      createUser(user.uid, userWithoutToken);
      setUser(user); // user with token avaialble to client-side application

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

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    signinWithGitHub,
    signinWithGoogle,
    signout,
  };
}

const formatUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    token: user.ya,
    provider: user.providerData[0].providerId,
    photoUrl: user.photoURL,
  };
};
