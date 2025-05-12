// filepath: c:\Users\kamal\Desktop\mdUi-dummy\pages\_app.jsx
import { ThemeProvider } from "next-themes";

export const  CustomThemeProvider=({ Component, pageProps }) =>{
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}