import { UploadOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space, TimePicker, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import get from 'lodash/get';
import isInteger from 'lodash/isInteger';
import isString from 'lodash/isString';
import moment from 'moment';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import { mergeDateAndTime } from '../../logic/timeSelector';
import { getTokenManager, TokenManager } from '../../logic/tokenManager';
import { InProgressGiftMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { TokenLabel } from '../TokenLabel';

type Props = {
  parentFieldName: string | number,
  fieldPath: (string | number)[]
}

export const GiftForm : React.FC<Props> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("Gift Form Error: No Wallet connected");
    return null;
  }
  const handleImageChange = (info: UploadChangeParam) => {
    const newFileList = info.fileList.slice(-1);
    info.fileList = newFileList;
    setFileList(newFileList);
  }

  const dontUploadImage = (data: UploadRequestOption) => {
    // Note(ggranito): this is needed to tell the UI we're not uploading it
    // The second arg isn't nullable by the lib types, but it is ok
    // I checked the antd code and the underlying rc-upload code to make sure
    // it is ok
    (data.onSuccess as any)(null, null);
  };

  const sendTimeTypeChanged = (prev: any, cur: any) => get(prev, [...props.fieldPath, "sendTimeType"]) !== get(cur, [...props.fieldPath, "sendTimeType"]);

  return (
    <>
      <Form.Item
        label={wrapLabel("Recipient")}
        name={[props.parentFieldName, "recipient"]}>
        <Input/>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Send Time")}
        shouldUpdate={sendTimeTypeChanged}
        style={styles.inputRow}>
          {({getFieldValue}) => (
            <Space>
              <Form.Item name={[props.parentFieldName, "sendTimeType"]}>
                <Radio.Group>
                  <Radio.Button value="now">Now</Radio.Button>
                  <Radio.Button value="schedule">Schedule</Radio.Button>
                </Radio.Group>
              </Form.Item>
              { getFieldValue([...props.fieldPath, "sendTimeType"]) === "schedule" && (
                <>
                  <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "sendTimeDate"]}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "sendTimeTime"]}>
                    <TimePicker />
                  </Form.Item>
                </>
              )}
            </Space>
          )}
      </Form.Item>
      <Form.Item
        label={wrapLabel("Value")}
        style={styles.inputRow}>
          <Space>
            <Form.Item name={[props.parentFieldName, "lifetimeValue"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "tokenAddress"]}>
              <Select allowClear={false} style={styles.tokenSelect}>
                {tokenManager.tokens.map((token) =>
                  <Select.Option value={token.address} key={`mint-gift-token-dropdown-${token.address}`}>
                    <span style={styles.selectOptionContainer}>
                      <TokenLabel address={token.address}/>
                    </span>
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          </Space>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Gift Name")}
        name={[props.parentFieldName, "giftName"]}>
        <Input/>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Message")}
        name={[props.parentFieldName, "giftMessage"]}>
        <Input/>
      </Form.Item>
      <Form.Item
        label={wrapLabel("Image")}
        name={[props.parentFieldName, "giftImage"]}>
        <Upload
          listType="picture"
          fileList={fileList}
          accept=".png,.jpg,.mp4"
          multiple={false}
          customRequest={dontUploadImage}
          onChange={handleImageChange}
          >
          <Button icon={<UploadOutlined />}>Upload Image or mp4</Button>
        </Upload>
      </Form.Item>
    </>
  );
}

export const parseGiftFormData = (formData: any, tokenManager: TokenManager) : InProgressGiftMagnetDefinition =>  {

  const giftMagnetDefinition : InProgressGiftMagnetDefinition = {
    type: "gift"
  }

  if (formData == null) {
    return giftMagnetDefinition;
  }

  // Parse Recipient
  const recipient = formData.recipient;
  if (isString(recipient) && recipient !== "") {
    giftMagnetDefinition.recipient = recipient;
  }

  // Parse Lifetime val
  const lifetimeValue = formData.lifetimeValue;
  if (isInteger(lifetimeValue) && lifetimeValue > 0) {
    giftMagnetDefinition.lifetimeValue = lifetimeValue;
  }

  // Parse Token Address
  const tokenAddress = formData.tokenAddress;
  giftMagnetDefinition.token = tokenManager.getTokenInfo(tokenAddress);

  // Parse Times
  const sendTimeType = formData.sendTimeType;
  const sendTimeDate = formData.sendTimeDate;
  const sendTimeTime = formData.sendTimeTime;
  const sendTime  = (() => {
      if (sendTimeType === "now") {
        return moment();
      }

      if (sendTimeType === "schedule" && moment.isMoment(sendTimeDate) && moment.isMoment(sendTimeTime)) {
        return mergeDateAndTime(sendTimeDate, sendTimeTime);
      }

      return null;
  })();
  if (moment.isMoment(sendTime)) {
    giftMagnetDefinition.sendTime = sendTime;
  }

  // Parse giftName
  const giftName = formData.giftName;
  if (isString(giftName)) {
    giftMagnetDefinition.giftName = giftName;
  }

  // Parse giftMessage
  const giftMessage = formData.giftMessage;
  if (isString(giftMessage)) {
    giftMagnetDefinition.giftMessage = giftMessage;
  }

  // Parse giftImageUrl
  const giftFile = get(formData, "giftImage.file.originFileObj");
  if (giftFile instanceof Blob) {
    giftMagnetDefinition.giftImageUrl = URL.createObjectURL(giftFile);
  }

  return giftMagnetDefinition;
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
