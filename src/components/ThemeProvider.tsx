import "@fontsource/poppins";
import "antd/dist/antd.css";
import * as React from "react";
import "./ThemeProvider.css";

export const ThemeProvider: React.FC<{children: React.ReactNode}> = (props) => {
  return (
    <>
      {props.children}
    </>
  );
}
