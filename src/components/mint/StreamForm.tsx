import { DatePicker, Form, Input, InputNumber, Select, Space, TimePicker } from 'antd';
import isInteger from 'lodash/isInteger';
import isString from 'lodash/isString';
import moment from 'moment';
import React from 'react';
import { isTimeUnit, mergeDateAndTime, TimeUnits } from '../../logic/timeSelector';
import { isTokenType, TokenTypes } from '../../logic/tokenType';
import { InProgressStreamMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';


type Props = {
  parentFieldName: string | number
}

export const StreamForm : React.FC<Props> = (props) => {
  return (
    <>
      <Form.Item
        label={wrapLabel("Recipient")}
        name={[props.parentFieldName, "recipient"]}>
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
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "endTimeAmount"]}>
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
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "lifetimeValue"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item style={styles.inputRowItem} name={[props.parentFieldName, "tokenType"]}>
              <Select options={TokenTypes} allowClear={false} />
            </Form.Item>
          </Space>
      </Form.Item>
    </>
  );
}

export const parseStreamFormData = (formData: any) : InProgressStreamMagnetDefinition =>  {

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

  // Parse Lifetime val
  const lifetimeValue = formData.lifetimeValue;
  if (isInteger(lifetimeValue) && lifetimeValue > 0) {
    streamMagnetDefinition.lifetimeValue = lifetimeValue;
  }

  // Parse TokenType
  const tokenType = formData.tokenType;
  if (isTokenType(tokenType)) {
    streamMagnetDefinition.tokenType = tokenType;
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
    if (isInteger(endTimeAmount) && endTimeAmount >=0 && isTimeUnit(endTimeUnit)) {
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
  }
}
