import { MinusCircleOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Form, Radio } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import get from 'lodash/get';
import moment from 'moment';
import * as React from 'react';
import StreamSvg from '../../images/sablier.svg';
import VestSvg from '../../images/yfi.svg';
import GiftSvg from '../../images/ygift.svg';
import { getTokenManager, TokenManager } from '../../logic/tokenManager';
import { MagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { GiftForm } from './GiftForm';
import { StreamForm } from './StreamForm';
import { VestForm } from './VestForm';


type Props = {
  index: number,
  field: FormListFieldData,
  fieldPath: (string | number)[],
  setSelfValue: (value: any) => void,
  removeSelf: () => void
}
const now = moment();
export const DEFAULT_FORM_VALUES = (tokenManager: TokenManager) : {[key in MagnetDefinition["type"]]: any} => ({
  vest: {
    type: "vest",
    recipient: "",
    // cliffTimeAmount: 1,
    cliffTimeUnit: "years",
    // endTimeAmount: 4,
    endTimeUnit: "years",
    // lifetimeValue: 20000,
    startTimeTime: now,
    startTimeDate: now,
    tokenAddress: tokenManager.getTokenInfoBySymbol("DAI")?.address ?? tokenManager.tokens[0].address,
  },
  gift: {
    type: "gift",
    giftImage: undefined,
    giftMessage: "",
    giftName: "",
    recipient: "",
    sendTimeType: "now",
    sendTimeDate: now,
    sendTimeTime: now,
    tokenAddress: tokenManager.getTokenInfoBySymbol("DAI")?.address ?? tokenManager.tokens[0].address,
    // lifetimeValue: 1000
  },
  stream: {
    type: "stream",
    recipient: "",
    // endTimeAmount: 4,
    endTimeUnit: "years",
    // lifetimeValue: 20000,
    startTimeTime: now,
    startTimeDate: now,
    tokenAddress: tokenManager.getTokenInfoBySymbol("DAI")?.address ?? tokenManager.tokens[0].address,
  }
});

export const MagnetForm : React.FC<Props> = (props: Props) => {

  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("Magnet Form Error: No Wallet connected");
    return null;
  }

  const onTypeChange = (event: any) => {
    const newType = event.target?.value;
    if (newType === "vest") {
      props.setSelfValue(DEFAULT_FORM_VALUES(tokenManager).vest);
    } else if (newType === "stream") {
      props.setSelfValue(DEFAULT_FORM_VALUES(tokenManager).stream);
    } else if (newType === "gift") {
      props.setSelfValue(DEFAULT_FORM_VALUES(tokenManager).gift);
    }
  };

  const typeDidChange = (prev: any, cur: any) => get(prev, [...props.fieldPath, "type"]) !== get(cur, [...props.fieldPath, "type"]);

  return (
    <div style={styles.container}>
      <div style={styles.index}>
        <div style={styles.indexText}>
          {props.index + 1}
        </div>
      </div>
      <div style={styles.formContainer}>
        <Form.Item shouldUpdate={typeDidChange}>
          {({getFieldValue }) => {
            const type = getFieldValue([...props.fieldPath, "type"]);

            return (
              <div style={styles.typeChooser}>
                <Form.Item
                  noStyle
                  name={[props.field.name, "type"]}>
                  <Radio.Group buttonStyle="solid" size="large" onChange={onTypeChange}>
                    <Radio.Button value="vest">Vest</Radio.Button>
                    <Radio.Button value="stream">Stream</Radio.Button>
                    <Radio.Button value="gift">Gift</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Button
                  style={styles.removeButton} type="text" shape="circle" size="large"
                  icon={<MinusCircleOutlined />}
                  onClick={props.removeSelf} />
                { type === "vest" && <TypeTag svg={VestSvg} text="Vested via Yearn Escrow" /> }
                { type === "stream" && <TypeTag svg={StreamSvg} text="Streamed via Sablier" /> }
                { type === "gift" && <TypeTag svg={GiftSvg} text="Gifted via yGift" /> }
              </div>
            )
          }}

        </Form.Item>
        <Form.Item style={styles.subformContainer} shouldUpdate={typeDidChange}>
          {({getFieldValue}) => {
            const type = getFieldValue([...props.fieldPath, "type"]);
            if (type === "vest") {
              return <VestForm parentFieldName={props.field.name} />
            } else if (type==="stream") {
              return <StreamForm parentFieldName={props.field.name} />
            } else if (type==="gift") {
              return <GiftForm parentFieldName={props.field.name} fieldPath={props.fieldPath}/>
            }
          }}
        </Form.Item>
      </div>
    </div>
  );
};

const styles: Stylesheet = {
  container: {
    display: "flex",
    marginTop: 35,
    marginBottom: 0
  },
  index: {
    flexGrow: 0,
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1890FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  indexText:{
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600
  },
  formContainer: {
    flex: 1,
    marginLeft: 16,
  },
  subformContainer: {
    marginBottom: 0,
    minWidth: 810
  },
  typeChooser: {
    display: "flex",
    alignItems: "flex-start"
  },
  removeButton: {
    color: "#8C8C8C",
    paddingTop: 6.4,
    marginLeft: 9,
    marginRight: 9,
  }
};


type TypeTagProps = {
  svg: any,
  text: string
}
const TypeTag : React.FC<TypeTagProps> = (props) => {
  return (
    <div style={typeTagStyles.container}>
      <props.svg style={typeTagStyles.image} width={16} height={16} />
      <div>{props.text}</div>
    </div>
  )
}

const typeTagStyles : Stylesheet = {
  container: {
    display: "flex",
    alignItems: "center",
    height: 40,
    marginLeft: 48,
    marginRight: 8
  },
  image: {
    margin: 8
  },
  inputRow: {
    marginBottom: 0
  }
}
