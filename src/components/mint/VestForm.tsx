import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { DatePicker, Form, Input, InputNumber, Select, Space, TimePicker } from 'antd';
import isFinite from 'lodash/isFinite';
import isString from 'lodash/isString';
import moment from 'moment';
import React from 'react';
import { isTimeUnit, mergeDateAndTime, TimeUnits } from '../../logic/timeSelector';
import { getTokenManager, TokenManager } from '../../logic/tokenManager';
import { InProgressVestMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { TokenLabel } from '../TokenLabel';

type Props = {
  parentFieldName: string | number
}

export const VestForm : React.FC<Props> = (props) => {
  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("Vest Form Error: No Wallet connected");
    return null;
  }

  return (
    <>
      <Form.Item
        label={wrapLabel("Recipient")}
        name={[props.parentFieldName, "recipient"]}
        rules={[
          {
            validator: async (_, value) => {
              if (!value) {
                return Promise.reject(new Error('Please enter recipient address'));
              }
              else if (!isAddress(value)) {
                return Promise.reject(new Error('Invalid address'));
              }
            },
          },
        ]}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Start Time")}
        style={styles.inputRow}>
          <Space>
          <Form.Item name={[props.parentFieldName, "startTimeDate"]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name={[props.parentFieldName, "startTimeTime"]}>
            <TimePicker />
          </Form.Item>
          </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Cliff Time")}
        style={styles.inputRow}>
          <Space>
            <Form.Item name={[props.parentFieldName, "cliffTimeAmount"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "cliffTimeUnit"]}>
              <Select options={TimeUnits} allowClear={false} />
            </Form.Item>
          </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("End Time")}
        style={styles.inputRow}>
          <Space>
            <Form.Item name={[props.parentFieldName, "endTimeAmount"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "endTimeUnit"]}>
              <Select options={TimeUnits} allowClear={false} />
            </Form.Item>
          </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Lifetime Value")}
        style={styles.inputRow}>
          <Space>
            <Form.Item name={[props.parentFieldName, "lifetimeValue"]}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value <= 0) {
                      return Promise.reject(new Error('Value must be greater than zero'));
                    }
                  },
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "tokenAddress"]}>
              <Select allowClear={false} style={styles.tokenSelect} onChange={(e) => console.log()}>
                {tokenManager.tokens.map((token) =>
                  <Select.Option value={token.address} key={`mint-vest-token-dropdown-${token.address}`}>
                    <span style={styles.selectOptionContainer}>
                      <TokenLabel token={token}/>
                    </span>
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          </Space>
      </Form.Item>
    </>
  );
}

export const parseVestFormData = (formData: any, tokenManager: TokenManager) : InProgressVestMagnetDefinition =>  {

  const vestMagnetDefinition : InProgressVestMagnetDefinition = {
    type: "vest"
  }

  if (formData == null) {
    return vestMagnetDefinition;
  }

  // Parse Recipient
  const recipient = formData.recipient;
  if (isString(recipient) && recipient !== "") {
    vestMagnetDefinition.recipient = recipient;
  }

  // Parse tokenAddress
  const tokenAddress = formData.tokenAddress;
  if (tokenManager.isTokenAddress(tokenAddress)) {
    const token = tokenManager.getTokenInfo(tokenAddress);
    vestMagnetDefinition.token = token;

    // Parse Lifetime val - requires token to be defined
    const lifetimeValue = formData.lifetimeValue;
    if (isFinite(lifetimeValue) && lifetimeValue > 0 && token != null) {
      vestMagnetDefinition.lifetimeValue = tokenManager.convertToDecimals(BigNumber.from(lifetimeValue), token);
    }
  }

  // Parse Times
  const startTimeDate = formData.startTimeDate;
  const startTimeTime = formData.startTimeTime;
  if (moment.isMoment(startTimeDate) && moment.isMoment(startTimeTime)) {
    const startTime = mergeDateAndTime(startTimeDate, startTimeTime);
    vestMagnetDefinition.startTime = startTime;

    // Parse cliff (needs start time)
    const cliffTimeAmount = formData.cliffTimeAmount;
    const cliffTimeUnit = formData.cliffTimeUnit;
    if (isFinite(cliffTimeAmount) && cliffTimeAmount >=0 && isTimeUnit(cliffTimeUnit)) {
      vestMagnetDefinition.cliffTime = moment(startTime).add(cliffTimeAmount, cliffTimeUnit);
    }

    // Parse end (needs start time)
    const endTimeAmount = formData.endTimeAmount;
    const endTimeUnit = formData.endTimeUnit;
    if (isFinite(endTimeAmount) && endTimeAmount >=0 && isTimeUnit(endTimeUnit)) {
      vestMagnetDefinition.endTime = moment(startTime).add(endTimeAmount, endTimeUnit);
    }
  }

  return vestMagnetDefinition;
}

const wrapLabel = (label: string) => {
  return (
    <div style={styles.label}>
      {label}
    </div>
  );
}

const styles : Stylesheet = {
  inputRow: {
    marginBottom: 0
  },
  label: {
    width: 100,
    textAlign: "left"
  },
  tokenSelect: {
    width: 120,
  },
  selectOptionContainer: {
    height: 29,
    display: "flex",
    alignItems: "center",
  }
}
