import { PlusOutlined } from '@ant-design/icons';
import { getAddress, isAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Form, Input } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { navigate } from "gatsby";
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import throttle from 'lodash/throttle';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import GnosisLogo from '../../images/gnosis.png';
import { getGnosisManager } from '../../logic/gnosisManager';
import { getTokenManager, TokenManager } from '../../logic/tokenManager';
import { areMagnetDefinitions, InProgressMagnetDefinition, MagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { parseGiftFormData } from './GiftForm';
import { DEFAULT_FORM_VALUES, MagnetForm } from './MagnetForm';
import { MintReview } from './MintReview';
import { parseStreamFormData } from './StreamForm';
import { parseVestFormData } from './VestForm';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 0 },
};

type Props = {
  initialSelection?: MagnetDefinition["type"];
}

export const MultiMagnetForm : React.FC<Props> = (props) => {
  const [ form ] = Form.useForm()

  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("MultiMagnet Form Error: No Wallet connected");
    return null;
  }

  const initialValue = useMemo(() => DEFAULT_FORM_VALUES(tokenManager)[props.initialSelection ?? "vest"], [tokenManager]);

  const initialInProgressMagnets = useMemo(() => parseFormData({magnets: [initialValue]}, tokenManager).magnets, [initialValue, tokenManager]);
  const [ inProgressMagnets, setInProgressMagnets] = useState<InProgressMagnetDefinition[]>(initialInProgressMagnets);

  const [ mintButtonSpinner, setMintButtonSpinner ] = useState(false);
  // TODO: implement proper error handling to hide spinner when MetaMask/TX errors occur
  setTimeout(() => {
    setMintButtonSpinner(false);
  }, 15000);

  // Note(ggranito): Need to useRef to make sure it's the same function across renders
  const updateTable = useRef(throttle((formData) => {
    setInProgressMagnets(parseFormData(formData, tokenManager).magnets);
  }, 200)).current;

  const getMagnetFormValueSetter = (index: number) => (value: any) => {
    const curMagnets = form.getFieldsValue().magnets;
    const nextMagnets = [...curMagnets]; //clone array
    nextMagnets[index] = value;
    const newFormData = {
      magnets: nextMagnets
    }
    form.setFieldsValue(newFormData);
    updateTable(newFormData);
  };

  const onSubmit = useCallback(async (formData: any) => {
    setMintButtonSpinner(true);
    console.log(formData)
    const {
      magnets,
      safeAddress
    } = parseFormData(formData, tokenManager);
    if (!areMagnetDefinitions(magnets)){
      setMintButtonSpinner(false);
      console.error("FormSubmissionError: Magnet definitions are incomplete");
      console.log(magnets);
      return;
    }
    if (safeAddress == null || !isAddress(safeAddress)) {
      setMintButtonSpinner(false);
      console.error(`FormSubmissionError: Invalid Safe Address ${safeAddress}`);
      return;
    }
    if (web3 == null) {
      setMintButtonSpinner(false);
      console.error("FormSubmissionError: Web3 is null");
      return;
    }
    const gnosisManager = getGnosisManager(web3);
    if (gnosisManager == null) {
      setMintButtonSpinner(false);
      console.error("FormSubmissionError: Unable to get GnosisManager");
      return;
    }
    const safeTxHash = await gnosisManager.submitMagnets(magnets, safeAddress);
    navigate(`/review/${safeTxHash}`, {
      state: {
        mintSuccess: true,
       },
    });
  }, [web3])

  return (
    <Form
      {...layout}
      form={form}
      name="multi-magnet"
      colon={false}
      onValuesChange={(_, values) => updateTable(values)}
      onFinish={onSubmit}
    >
      <div style={styles.gnosisContainer}>
        <div style={styles.gnosisHeader}>
          <Avatar src={GnosisLogo} style={styles.gnosisHeaderImage} />
          <span style={styles.gnosisHeaderText}>Gnosis Safe multisig address to fund these magnets</span>
        </div>
        <Form.Item
          label={<div style={styles.gnosisLabel}>Address</div>}
          labelAlign="left"
          labelCol={{span: 0}}
          style={styles.gnosisFormItem}
          name="safeAddress">
          <Input/>
        </Form.Item>
      </div>
      <Form.List name="magnets" initialValue={[initialValue]}>
        {(fields, {add, remove}) => (
          <>
            {fields.map((f, i) => (
              <MagnetForm field={f} index={i} key={i} fieldPath={["magnets", f.name]}
                setSelfValue={getMagnetFormValueSetter(i)} removeSelf={() => remove(f.name)} />
            ))}
            <Button
              style={styles.addMagnetButton}
              type="dashed"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => add(DEFAULT_FORM_VALUES(tokenManager).vest)}>
              Add another magnet
            </Button>
          </>
        )}
      </Form.List>
      <MintReview magnets={inProgressMagnets}/>
      <div style={styles.beta}>Beta Warning: use at your own risk</div>
      <div style={styles.disclaimer}>Please take note that this is a beta version feature and is provided on an "as is" and "as available" basis.</div>
      <div style={styles.disclaimer}>Magnet or its developers do not give any warranties and will not be liable for any loss, direct or indirect through continued use of this feature.</div>
      <div style={styles.disclaimer}>By clicking "Mint Magnets" below, you acknowledge this risk and assume all responsibility.</div>
      <Form.Item {...tailLayout}>
        <Button style={styles.submitButton} loading={mintButtonSpinner} type="primary" htmlType="submit" size="large">
          Mint Magnets
        </Button>
      </Form.Item>
    </Form>
  );
};

type ParsedFormData = {
  magnets: InProgressMagnetDefinition[],
  safeAddress?: string
};
const parseFormData = (formData: any, tokenManager: TokenManager) : ParsedFormData => {
  const parsedSafeAddress = (() => {
    try {
      return getAddress(get(formData, "safeAddress"));
    } catch {
      return undefined;
    }
  })();

  const parsedMagnets = (() => {
    const magnets = get(formData, "magnets");
    if (!isArray(magnets)) {
      return [];
    }

    return flatMap(magnets, (maybeMag) : InProgressMagnetDefinition[] => {
      const type = get(maybeMag, "type");
      if (type === "vest") {
        return [parseVestFormData(maybeMag, tokenManager)];
      }
      if (type === "stream") {
        return [parseStreamFormData(maybeMag, tokenManager)];
      }
      if (type === "gift") {
        return [parseGiftFormData(maybeMag, tokenManager)];
      }
      return []
    });
  })();

  return {
    safeAddress: parsedSafeAddress,
    magnets: parsedMagnets
  }
}

const styles : Stylesheet = {
  gnosisContainer: {
    flex: 1,
    marginBottom: 0,
    minWidth: 810
  },
  gnosisHeader: {
    marginTop: 24,
    marginBottom: 0,
  },
  gnosisHeaderImage: {
    width: 40,
    height: 40,
  },
  gnosisHeaderText: {
    marginLeft: 16,
    fontSize: 16,
    lineHeight: "38px",
  },
  gnosisLabel: {
    width: 100,
    textAlign: "left",
  },
  gnosisFormItem: {
    marginLeft: 56,
    marginTop: 24,
    marginBottom: 60,
    minWidth: 810,
    // Hack because @willhennesy didn't do this correctly
    paddingRight: 165
  },
  addMagnetButton: {
    marginTop: 35,
    marginBottom: 35
  },
  beta: {
    marginTop: 48,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: "22px",
    color: "#8C8C8C",
  },
  disclaimer: {
    fontSize: 14,
    fontWeight: 300,
    lineHeight: "22px",
    color: "#8C8C8C",
  },
  submitButton: {
    marginTop: 48,
  }
}
