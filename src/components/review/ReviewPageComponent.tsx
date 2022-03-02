import Icon, { CopyOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "web3-react-core";
import { Button, Card, Skeleton } from "antd";
import { Content } from "antd/lib/layout/layout";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import React, { useCallback, useEffect, useState } from 'react';
import GoToLink from '../../images/GoToLink.svg';
import { getGnosisManager, getSafeAppTransactionsPageUrl, GnosisLookupError, GnosisLookupResult, lookupGnosisTxn } from '../../logic/gnosisManager';
import { Wallet } from '../Wallet';
import { RecipientCard } from "./RecipientCard";
import { Subtotal } from "./Subtotal";

type Props = {
  mintSuccess?: boolean,
  safeTxHash?: string
}

export const ReviewPageComponent: React.FC<Props> = ({ mintSuccess, safeTxHash }) => {
  const [gnosisResult, setGnosisResult] = useState<GnosisLookupResult | GnosisLookupError | undefined>(undefined);
  const web3 = useWeb3React<Web3Provider>();

  useEffect(() => {
    (async () => {
      if (safeTxHash != null && safeTxHash !== "") {
        setGnosisResult(await lookupGnosisTxn(safeTxHash));
      }
    })()
  }, []);

  const doApproval = useCallback(async () => {
    if (!gnosisResult?.successful) {
      throw Error("Gnosis Approval Error: Can't approve unknown txn");
    }
    if (gnosisResult.chainId !== web3.chainId) {
      throw Error("Gnosis Approval Error: ChainId of signer is incorrect");
    }
    const _successful = await getGnosisManager(web3)?.submitApproval(gnosisResult.gnosisResponse);
    //TODO: Use successful (and any errors above) to display messages
  }, [web3, gnosisResult]);

  // Note use better logic to check hash
  if (safeTxHash == null || safeTxHash === "") {
    return (
      <Content style={styles.content}>
        <div>Invalid Gnosis Safe Transaction Hash</div>
      </Content>
    );
  }

  if (gnosisResult == null) {
    return (
      <Content style={styles.content}>
        <div style={styles.title}>Review Mint Transaction</div>
        <Card style={styles.loadingCard} bodyStyle={styles.loadingCardBody}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      </Content>
    );
  }
  else if (gnosisResult.successful === false) {
    return (
      <Content style={styles.content}>
        <div>Sorry, an error occured</div>
      </Content>
    );
  }
  else {
    const magnets = gnosisResult.magnets;
    const groupedMagnets = groupBy(magnets, "recipient");
    return (
      <Content style={styles.content}>
        <>{mintSuccess ? (
          <SuccessMessage safeAddress={gnosisResult.gnosisResponse.safe} chainId={gnosisResult.chainId} />
        ) : (
          <div style={styles.title}>Review Mint Transaction</div>
        )}</>
        {map(groupedMagnets, (magnetsForRecipient, recipient) =>
          <RecipientCard key={`recipient-card-${recipient}`} recipient={recipient} magnets={magnetsForRecipient} />
        )}
        <div style={styles.subtitle}>Total</div>
        <Subtotal magnets={magnets} />
        {mintSuccess ? (
          <></>
        ) : (
          <>
            {web3.chainId ? (
              <Button
                onClick={doApproval}
                style={styles.signButton}
                type="primary"
                size="large">
                Sign Transaction
              </Button>
            ) : (
              <Wallet style={styles.connectWalletButton} />
            )}
          </>
        )}
      </Content>
    );
  }
}

type SuccessMessageProps = {
  safeAddress: string,
  chainId: number,
}
const SuccessMessage: React.FC<SuccessMessageProps> = (props) => {
  const url = window.location.href;
  const safeAppUrl = getSafeAppTransactionsPageUrl(props.safeAddress, props.chainId);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  }

  const handleGnosisButton = () => {
    window.open(safeAppUrl, "_blank", "noopener");
  }

  return (
    <>
      <div style={styles.title}>Success: Magnets Submitted to Gnosis Safe</div>
      <div style={styles.tip}>
        Share this page with your multisig for easy review!
        <div>
          <Button style={styles.copyButton} type="primary" icon={<CopyOutlined />} size="large" onClick={handleCopy}>
            Copy link
          </Button>
          <Button style={styles.goToGnosisButton} ghost type="primary" icon={<Icon style={styles.goToLink} component={GoToLink} />} size="large" onClick={handleGnosisButton}>
            Go to Gnosis Safe
          </Button>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
    textAlign: "left",
  },
  title: {
    fontSize: 36,
    fontWeight: 600,
    lineHeight: "44px",
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 600,
    lineHeight: "38px",
    marginTop: 48,
    marginBottom: 24,
  },
  tip: {
    width: "fit-content",
    backgroundColor: "#E6F7FF",
    borderRadius: 12,
    fontSize: 20,
    fontWeight: 600,
    paddingTop: 18,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    marginTop: 48,
    marginBottom: 58
  },
  copyButton: {
    borderRadius: 12,
    marginTop: 16
  },
  goToGnosisButton: {
    borderRadius: 12,
    marginTop: 16,
    marginLeft: 24,
  },
  goToLink: {
    color: "#E6F7FF",
  },
  loadingCard: {
    borderRadius: 6,
    marginTop: 32,
  },
  loadingCardBody: {
    paddingTop: 32,
    paddingBottom: 30,
    paddingLeft: 32,
    paddingRight: 64,
  },
  connectWalletButton: {
    borderColor: "#1890ff",
    marginTop: 48
  },
  signButton: {
    marginTop: 48,
  }
}
