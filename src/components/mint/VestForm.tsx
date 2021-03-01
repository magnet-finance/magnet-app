import { DatePicker, Form, Input, InputNumber, Select, Space, TimePicker } from 'antd';
import React from 'react';
import { Stylesheet } from '../../types/stylesheet';

type Props = {
  parentFieldName: string | number
}

const TimeUnits = [
  { label: 'Years', value: 'y' },
  { label: 'Months', value: 'm' },
  { label: 'Days', value: 'd' },
  { label: 'Hours', value: 'h' },
];

const TokensTypes = [
  { label: 'Sushi', value: 'sushi' },
  { label: 'DAI', value: 'dai' },
];

export const VestForm : React.FC<Props> = (props) => {
  return (
    <>
      <Form.Item
        label={wrapLabel("Recipient")}
        name={[props.parentFieldName, "recipient"]}>
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
            <Form.Item name={[props.parentFieldName, "lifetimeValue"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "tokenType"]}>
              <Select options={TokensTypes} allowClear={false} />
            </Form.Item>
          </Space>
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
