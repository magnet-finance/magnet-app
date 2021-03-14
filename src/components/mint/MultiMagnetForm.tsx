import { PlusOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Form } from 'antd';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import throttle from 'lodash/throttle';
import React, { useMemo, useRef, useState } from 'react';
import { getStreamTxn } from '../../logic/contracts/stream';
import { executeTransaction } from '../../logic/executeTransaction';
import { getTokenManager, TokenManager } from '../../logic/tokenManager';
import { InProgressMagnetDefinition, MagnetDefinition, StreamMagnetDefinition } from '../../types/magnet';
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

  const initialInProgressMagnets = useMemo(() => parseFormData({magnets: [initialValue]}, tokenManager), [initialValue, tokenManager]);
  const [ inProgressMagnets, setInProgressMagnets] = useState<InProgressMagnetDefinition[]>(initialInProgressMagnets);

  // Note(ggranito): Need to useRef to make sure it's the same function across renders
  const updateTable = useRef(throttle((formData) => {
    setInProgressMagnets(parseFormData(formData, tokenManager));
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

  const testSubmitFunc = async (formData: any) => {
    const magnets = parseFormData(formData, tokenManager);
    console.log(magnets);
    if (web3 == null) {
      return;
    }
    for (const magnet of magnets) {
      if (magnet.type === "stream") {
        const txn = await getStreamTxn(magnet as StreamMagnetDefinition, web3)
        console.log(txn);
        executeTransaction(txn[0], web3);
      }
    }
  }

  return (
    <Form
      {...layout}
      form={form}
      name="multi-magnet"
      colon={false}
      onValuesChange={(_, values) => updateTable(values)}
      onFinish={testSubmitFunc}
    >
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
      <Form.Item {...tailLayout}>
        <Button style={styles.submitButton} type="primary" htmlType="submit" size="large">
          Mint Magnets
        </Button>
      </Form.Item>
    </Form>
  );
};

const parseFormData = (formData: any, tokenManager: TokenManager) : InProgressMagnetDefinition[] => {
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
}

const styles : Stylesheet = {
  addMagnetButton: {
    marginTop: 35,
    marginBottom: 35
  },
  submitButton: {
    marginTop: 48,
  }
}
