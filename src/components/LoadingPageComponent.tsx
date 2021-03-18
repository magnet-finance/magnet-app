import { Skeleton } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from "react";

export const LoadingPageComponent: React.FC = () => {
  return (
    <Content style={styles.content}>
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </Content>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  },
}
