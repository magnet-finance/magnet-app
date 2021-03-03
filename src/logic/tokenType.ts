import find from "lodash/find";
import includes from "lodash/includes";
import map from "lodash/map";

export const TokenTypes = [
  { label: 'SUSHI', value: 'sushi' },
  { label: 'DAI', value: 'dai' },
];

export const isTokenType = (tokenType: any) : tokenType is string => includes(map(TokenTypes, "value"), tokenType);

export const getTokenDisplayString = (tokenType: any) : string | undefined =>
  find(TokenTypes, (t) => t.value.toUpperCase() === tokenType.toUpperCase())?.label;
