import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "web3-react-core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Button } from "antd";
import * as React from "react";
import { ChainManager } from '../logic/chainManager';

type Props = {
  style?: React.CSSProperties;
}

const injectedConnector = new InjectedConnector({
  supportedChainIds: ChainManager.SUPPORTED_CHAINS,
})

export const Wallet: React.FC<Props> = (props) => {
  const { account, activate, active, deactivate } = useWeb3React<Web3Provider>()

  const handleClickWhileActive = () => {
    deactivate();
  }

  const handleClickWhileInactive = () => {
    activate(injectedConnector);
  }

  const getShortAddress = () => {
    if (account != null) {
      if (account.length > 12) {
        return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
      } else {
        return account;
      }
    } else {
      return "-";
    }
  }

  return (
    <>
      {active ? (
        <Button
          onClick={handleClickWhileActive}
          style={props.style ? { ...styles.walletButton, ...props.style } : styles.walletButton}
          size="large">
          {getShortAddress()}
        </Button>
      ) : (
        <Button
          onClick={handleClickWhileInactive}
          style={props.style ? { ...styles.walletButton, ...props.style } : styles.walletButton}
          size="large">
          Connect a wallet
        </Button>
      )}
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  walletButton: {
    backgroundColor: "#F2F2F2",
    color: "#4F4F4F",
    borderRadius: 12,
    lineHeight: "24px",
  }
}
