'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useGetUserProfileQuery } from './features/auth/authApi';
import { restoreUser } from './features/auth/authSlice';
import { useAppDispatch } from './hooks';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // Step 1: On first client mount, instantly restore user from localStorage.
  // This prevents the Login/Signup flash for already-logged-in users.
  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  // Step 2: If a token exists, silently validate it via /users/me in the background.
  // This refreshes user data and handles expired tokens (will clear auth on 401).
  const hasToken = typeof window !== 'undefined'
    ? !!(localStorage.getItem('rajseba_access_token') || localStorage.getItem('token'))
    : false;

  useGetUserProfileQuery(undefined, {
    skip: !hasToken,
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
