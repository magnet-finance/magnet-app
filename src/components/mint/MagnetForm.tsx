import { Form, Radio } from 'antd';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { NamePath } from 'antd/lib/form/interface';
import get from 'lodash.get';
import * as React from 'react';
import StreamSvg from '../../images/sablier.svg';
import VestSvg from '../../images/yfi.svg';
import GiftSvg from '../../images/ygift.svg';
import { MagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { VestForm } from './VestForm';

type Props = {
  index: number,
  field: FormListFieldData,
  fieldPath: NamePath,
  setSelfValue: (value: any) => void
}
const now = Date.now();
const defaultFormValues : {[key in MagnetDefinition["type"]]: any} = {
  vest: {
    type: "vest",
    startTime: now + 24 * 60 * 60 * 1000,
    test: "vestasas"
  },
  gift: {
    type: "gift",
    test2: "giftsasfa"
  },
  stream: {
    type: "stream",
    startTime: now + 24 * 60 * 60 * 1000,
    test3: "streamasas"
  }
}
export const INITIAL_VALUE = defaultFormValues.vest;

export const MagnetForm : React.FC<Props> = (props: Props) => {

  const onTypeChange = (event) => {
    const newType = event.target.value;
    if (newType === "vest") {
      props.setSelfValue(defaultFormValues.vest);
    } else if (newType === "stream") {
      props.setSelfValue(defaultFormValues.stream);
    } else if (newType === "gift") {
      props.setSelfValue(defaultFormValues.gift);
    }
  }

  const typeDidChange = (prev, cur) => get(prev, [...props.fieldPath, "type"]) !== get(cur, [...props.fieldPath, "type"]);

  return (
    <div style={styles.container}>
      <div style={styles.index}>
        <div style={styles.indexText}>
          {props.index + 1}
        </div>
      </div>
      <div style={styles.formContainer}>
        <Form.Item shouldUpdate={typeDidChange}>
          {({getFieldValue }) => {
            const type = getFieldValue([...props.fieldPath, "type"]);

            return (
              <div style={styles.typeChooser}>
                <Form.Item
                  name={[props.field.name, "type"]}>
                  <Radio.Group buttonStyle="solid" size="large" onChange={onTypeChange}>
                    <Radio.Button value="vest">Vest</Radio.Button>
                    <Radio.Button value="stream">Stream</Radio.Button>
                    <Radio.Button value="gift">Gift</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                { type === "vest" && <TypeTag svg={VestSvg} text="Vested via Yearn Escrow" /> }
                { type === "stream" && <TypeTag svg={StreamSvg} text="Streamed via Sablier" /> }
                { type === "gift" && <TypeTag svg={GiftSvg} text="Gifted via yGift" /> }
              </div>
            )
          }}

        </Form.Item>
        <Form.Item shouldUpdate={typeDidChange}>
          {({getFieldValue}) => {
            const type = getFieldValue([...props.fieldPath, "type"]);
            if (type === "vest") {
              return <VestForm parentFieldName={props.field.name}/>
            } else if (type==="stream") {

            } else if (type==="gift") {

            }
          }}
        </Form.Item>
      </div>
    </div>
  );
};

const styles: Stylesheet = {
  container: {
    display: "flex",
    marginTop: 35,
    marginBottom: 35
  },
  index: {
    flexGrow: 0,
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1890FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  indexText:{
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 600
  },
  formContainer: {
    flex: 1,
    marginLeft: 16
  },
  typeChooser: {
    display: "flex",
    alignItems: "flex-start"
  }
};


type TypeTagProps = {
  svg: any,
  text: string
}
const TypeTag : React.FC<TypeTagProps> = (props) => {
  return (
    <div style={typeTagStyles.container}>
      <props.svg style={typeTagStyles.image} width={16} height={16} />
      <div>{props.text}</div>
    </div>
  )
}

const typeTagStyles : Stylesheet = {
  container: {
    display: "flex",
    alignItems: "center",
    height: 40,
    marginLeft: 8,
    marginRight: 8
  },
  image: {
    margin: 8
  }
}
