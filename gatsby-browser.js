import React from 'react';
import { RootWrapper } from './src/root';

export const wrapRootElement = ({ element }) => {
  return (
    <RootWrapper>
      {element}
    </RootWrapper>
  )
};
