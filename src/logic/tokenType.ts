import find from "lodash/find";
import includes from "lodash/includes";
import map from "lodash/map";

export const TokenTypes = [
  { label: 'DAI', value: '0xad6d458402f60fd3bd25163575031acdce07538d' },
  { label: 'SUSHI', value: '0x3f2f7a251a5b160b8142552197494ae8f7698672' },
];

export const isTokenType = (tokenType: any) : tokenType is string => includes(map(TokenTypes, "value"), tokenType);

export const getTokenDisplayString = (tokenType: any) : string | undefined =>
  find(TokenTypes, (t) => t.value === tokenType)?.label;
