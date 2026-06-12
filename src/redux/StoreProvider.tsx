'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

import { useGetUserProfileQuery } from './features/auth/authApi';
import { useEffect, useState } from 'react';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Fetch the user profile if there's a token
  useGetUserProfileQuery(undefined, {
    skip: !token,
  });

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<typeof store>(null);
  
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}
