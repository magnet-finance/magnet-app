import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import * as React from "react";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

// markup
const ReviewPage = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ReviewPageComponent />
    </Web3ReactProvider>
  );
}

export default ReviewPage
