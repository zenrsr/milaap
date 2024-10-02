"use client";
import { Provider } from "jotai";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const JotaiProvider = ({ children }: Props) => {
  return <Provider>{children}</Provider>;
};

export default JotaiProvider;
