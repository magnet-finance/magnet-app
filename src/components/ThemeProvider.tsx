import "@fontsource/poppins";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/600.css";
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
