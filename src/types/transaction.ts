
export enum Operation {
  CALL = 0,
  DELEGATE_CALL = 1
};

export type Transaction = {
  operation: Operation
  to: string;
  value: string;
  data: string;
};

export const Transaction = {
  DEFAULT_OPERATION: Operation.CALL,
  DEFAULT_VALUE: '0x0',
  DEFAULT_DATA: '0x'
}
