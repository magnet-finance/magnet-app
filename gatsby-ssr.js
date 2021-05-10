import React from 'react';
import { RootWrapper } from './src/root';

export const wrapRootElement = ({ element }) => {
  return (
    <RootWrapper>
      {element}
    </RootWrapper>
  )
};

export const onRenderBody = ({ setHeadComponents }) => {
  const gAnalyticsInitScript = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());`;
  setHeadComponents([
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-X43VT43S51"></script>,
    <script dangerouslySetInnerHTML={{__html: gAnalyticsInitScript}} />
  ])
}
