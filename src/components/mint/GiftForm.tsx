import { UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space, TimePicker, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import get from 'lodash.get';
import { NamePath } from 'rc-field-form/es/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import React, { useState } from 'react';
import { Stylesheet } from '../../types/stylesheet';

type Props = {
  parentFieldName: string | number,
  fieldPath: NamePath
}

const TokensTypes = [
  { label: 'Sushi', value: 'sushi' },
  { label: 'DAI', value: 'dai' },
];

export const GiftForm : React.FC<Props> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleImageChange = (info: UploadChangeParam) => {
    const newFileList = info.fileList.slice(-1);
    info.fileList = newFileList;
    setFileList(newFileList);
  }

  const dontUploadImage = (data: UploadRequestOption) => {
    data.onSuccess(null, null);
  };

  const sendTimeTypeChanged = (prev, cur) => get(prev, [...props.fieldPath, "sendTimeType"]) !== get(cur, [...props.fieldPath, "sendTimeType"]);

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
            <Form.Item name={[props.parentFieldName, "giftValue"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "tokenType"]}>
              <Select options={TokensTypes} allowClear={false} />
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
  }
}
