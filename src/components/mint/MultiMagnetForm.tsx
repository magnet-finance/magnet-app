import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import throttle from 'lodash/throttle';
import React, { useRef, useState } from 'react';
import { InProgressMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { parseGiftFormData } from './GiftForm';
import { INITIAL_VALUE, MagnetForm } from './MagnetForm';
import { MintReview } from './MintReview';
import { parseStreamFormData } from './StreamForm';
import { parseVestFormData } from './VestForm';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


export const MultiMagnetForm : React.FC = () => {
  const [ form ] = Form.useForm()

  const initialInProgressMagnets = parseFormData({magnets: [INITIAL_VALUE]});
  const [ inProgressMagnets, setInProgressMagnets] = useState<InProgressMagnetDefinition[]>(initialInProgressMagnets);

  // Note(ggranito): Need to useRef to make sure it's the same function across renders
  const updateTable = useRef(throttle((formData) => {
    setInProgressMagnets(parseFormData(formData));
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

  return (
    <Form
      {...layout}
      form={form}
      name="multi-magnet"
      colon={false}
      onValuesChange={(_, values) => updateTable(values)}
      onFinish={(e) => { console.log(e); console.log(parseFormData(e))}}
    >
      <Form.List name="magnets" initialValue={[INITIAL_VALUE]}>
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
              onClick={() => add(INITIAL_VALUE)}>
              Add another magnet
            </Button>
          </>
        )}
      </Form.List>
      <MintReview magnets={inProgressMagnets}/>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const parseFormData = (formData: any) : InProgressMagnetDefinition[] => {
  const magnets = get(formData, "magnets");
  if (!isArray(magnets)) {
    return [];
  }

  return flatMap(magnets, (maybeMag) : InProgressMagnetDefinition[] => {
    const type = get(maybeMag, "type");
    if (type === "vest") {
      return [parseVestFormData(maybeMag)];
    }
    if (type === "stream") {
      return [parseStreamFormData(maybeMag)];
    }
    if (type === "gift") {
      return [parseGiftFormData(maybeMag)];
    }
    return []
  });
}

const styles : Stylesheet = {
  addMagnetButton: {
    marginTop: 35,
    marginBottom: 35
  }
}
