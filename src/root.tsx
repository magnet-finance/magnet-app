import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from 'web3-react-core';
import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';

const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}


export const RootWrapper: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Web3ReactProvider>
  );
}
