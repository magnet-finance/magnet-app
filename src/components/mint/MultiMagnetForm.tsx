import { Button, Form } from 'antd';
import * as React from 'react';
import { INITIAL_VALUE, MagnetForm } from './MagnetForm';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


export const MultiMagnetForm : React.FC = () => {
  const [ form ] = Form.useForm()
  console.log(form);
  const getMagnetFormValueSetter = (index: number) => (value: any) => {
    const curMagnets = form.getFieldsValue().magnets;
    const nextMagnets = [...curMagnets]; //clone array
    nextMagnets[index] = value;
    form.setFieldsValue({
      magnets: nextMagnets
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="multi-magnet"
      onFinish={(e) => console.log(e)}
    >
      <Form.List name="magnets" initialValue={[INITIAL_VALUE]}>
        {(fields, {add}) => (
          <>
            {fields.map((f, i) => (
              <MagnetForm field={f} index={i} key={i} fieldPath={["magnets", f.name]} setSelfValue={getMagnetFormValueSetter(i)} />
            ))}
            <Button onClick={() => add(INITIAL_VALUE)}>
              Add
            </Button>
          </>
        )}
      </Form.List>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
