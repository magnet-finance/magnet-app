import { BigNumber } from "@ethersproject/bignumber";
import { MagnetDefinition } from "./magnet";

export enum Operation {
  CALL = 0,
  DELEGATE_CALL = 1
};

export type Transaction = {
  operation: Operation
  to: string;
  value: BigNumber;
  data: string;
};

export const Transaction = {
  DEFAULT_OPERATION: Operation.CALL,
  DEFAULT_VALUE: BigNumber.from(0),
  DEFAULT_DATA: '0x'
}

export type TxnParser<T extends MagnetDefinition = MagnetDefinition> = (txns: Transaction[], chainId: number) => { magnets: T[], rest: Transaction[] } | null;
