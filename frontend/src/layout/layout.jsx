import React from "react";
import { CustomThemeProvider } from "../components/theme-provider";
import "./globle.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>2D Metaverse Platform</title>
        <meta
          name="description"
          content="Create, Explore, and Hang Out in a Personalized 2D Metaverse"
        />
      </head>
      <body>
        <CustomThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  );
}