"use client";
import { appDetails, userSession } from "@/utils/stacks.data";
import { Connect } from "@stacks/connect-react";
import React from "react";

const StacksProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Connect
      authOptions={{
        appDetails: appDetails,
        userSession,
      }}
    >
      {children}
    </Connect>
  )
};

export default StacksProvider