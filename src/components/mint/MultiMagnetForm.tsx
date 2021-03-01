import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import * as React from 'react';
import { Stylesheet } from '../../types/stylesheet';
import { INITIAL_VALUE, MagnetForm } from './MagnetForm';
import { MintReview } from './MintReview';


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
      colon={false}
      onFinish={(e) => console.log(e)}
    >
      <Form.List name="magnets" initialValue={[INITIAL_VALUE]}>
        {(fields, {add}) => (
          <>
            {fields.map((f, i) => (
              <MagnetForm field={f} index={i} key={i} fieldPath={["magnets", f.name]} setSelfValue={getMagnetFormValueSetter(i)} />
            ))}
            <Button
              style={styles.addMagnetButton}
              type="dashed"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => add(INITIAL_VALUE)}>
              Add another magnet
            </Button>
          </>
        )}
      </Form.List>
      <MintReview />
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const styles : Stylesheet = {
  addMagnetButton: {
    marginTop: 35,
    marginBottom: 35
  }
}
