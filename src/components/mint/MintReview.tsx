import React from 'react';
import { Stylesheet } from '../../types/stylesheet';

type Props = {
}


export const MintReview : React.FC<Props> = (props) => {
  return (
    <>
      <div style={styles.title}>Review</div>

    </>
  );
}

const styles : Stylesheet = {
  title: {
    fontSize: 36,
    fontWeight: 600,
  }
}
