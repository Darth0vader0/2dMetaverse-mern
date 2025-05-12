"use client";

import React from "react";
import { cn } from "../libs/utils";

export function PageBackground({ className, children }) {
  return <div className={cn("min-h-screen flex flex-col", className)}>{children}</div>;
}