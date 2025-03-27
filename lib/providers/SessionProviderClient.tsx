"use client";

import { SessionProvider } from "next-auth/react";
import React from 'react';

function SessionClientProvider({
  children,
  session
}: {
  children: React.ReactNode,
  session?: any // Adjust the type according to your session type
}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default SessionClientProvider;