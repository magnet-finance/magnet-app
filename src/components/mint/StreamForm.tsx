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
import { InProgressStreamMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { TokenLabel } from '../TokenLabel';

type Props = {
  parentFieldName: string | number
}

export const StreamForm : React.FC<Props> = (props) => {
  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("Stream Form Error: No Wallet connected");
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
        help="Transaction will fail if executed after start time"
        style={styles.spaceForWarning}
        label={wrapLabel("Start Time")}>
        <Space>
          <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "startTimeDate"]}>
            <DatePicker />
          </Form.Item>
          <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "startTimeTime"]}>
            <TimePicker />
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("End Time")}>
          <Space>
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "endTimeAmount"]}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!value || value <= 0) {
                      return Promise.reject(new Error('Stream duration must be greater than zero'));
                    }
                  },
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "endTimeUnit"]}>
              <Select options={TimeUnits} allowClear={false} />
            </Form.Item>
          </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Lifetime Value")}>
          <Space>
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "lifetimeValue"]}
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
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "tokenAddress"]}>
              <Select allowClear={false} style={styles.tokenSelect}>
                {tokenManager.tokens.map((token) =>
                  <Select.Option value={token.address} key={`mint-stream-token-dropdown-${token.address}`}>
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

export const parseStreamFormData = (formData: any, tokenManager: TokenManager) : InProgressStreamMagnetDefinition =>  {

  const streamMagnetDefinition : InProgressStreamMagnetDefinition = {
    type: "stream"
  }

  if (formData == null) {
    return streamMagnetDefinition;
  }

  // Parse Recipient
  const recipient = formData.recipient;
  if (isString(recipient) && recipient !== "") {
    streamMagnetDefinition.recipient = recipient;
  }

  // Parse TokenAddress
  const tokenAddress = formData.tokenAddress;
  if (tokenManager.isTokenAddress(tokenAddress)) {
    const token = tokenManager.getTokenInfo(tokenAddress);
    streamMagnetDefinition.token = token;

    // Parse Lifetime val - requires token to be defined
    const lifetimeValue = formData.lifetimeValue;
    if (isFinite(lifetimeValue) && lifetimeValue > 0 && token != null) {
      streamMagnetDefinition.lifetimeValue = tokenManager.convertToDecimals(BigNumber.from(lifetimeValue), token);
    }
  }

  // Parse Times
  const startTimeDate = formData.startTimeDate;
  const startTimeTime = formData.startTimeTime;
  if (moment.isMoment(startTimeDate) && moment.isMoment(startTimeTime)) {
    const startTime = mergeDateAndTime(startTimeDate, startTimeTime);
    streamMagnetDefinition.startTime = startTime;

    // Parse end (needs start time)
    const endTimeAmount = formData.endTimeAmount;
    const endTimeUnit = formData.endTimeUnit;
    if (isFinite(endTimeAmount) && endTimeAmount >=0 && isTimeUnit(endTimeUnit)) {
      streamMagnetDefinition.endTime = moment(startTime).add(endTimeAmount, endTimeUnit);
    }
  }

  return streamMagnetDefinition;
}

const wrapLabel = (label: string) => {
  return (
    <div style={styles.label}>
      {label}
    </div>
  );
}

const styles : Stylesheet = {
  inputRowItem: {
    marginBottom: 0
  },
  spaceForWarning: {
    marginBottom: 24
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
