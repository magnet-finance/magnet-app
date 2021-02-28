import { DatePicker, Form, Input, InputNumber, Select, Space, TimePicker } from 'antd';
import React from 'react';

type Props = {
  parentFieldName: string | number
}

const TimeUnits = [
  { label: 'Years', value: 'y' },
  { label: 'Months', value: 'm' },
  { label: 'Days', value: 'd' },
  { label: 'Hours', value: 'h' },
];

export const VestForm : React.FC<Props> = (props) => {
  return (
    <>
      <Form.Item
        label="Recipient"
        name={[props.parentFieldName, "recipient"]}>
        <Input/>
      </Form.Item>
      <Form.Item
        label="Start Time">
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
        label="Cliff Time">
          <Space>
            <Form.Item name={[props.parentFieldName, "cliffTimeAmount"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item name={[props.parentFieldName, "cliffTimeUnit"]}>
              <Select options={TimeUnits} allowClear={false} />
            </Form.Item>
          </Space>
      </Form.Item>
    </>
  );
}
