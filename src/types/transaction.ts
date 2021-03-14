export type Transaction = {
  to: string;
  value: string;
  data: string;
};

export const Transaction = {
  DEFAULT_VALUE: '0x0',
  DEFAULT_DATA: '0x'
}
