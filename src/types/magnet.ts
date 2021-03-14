import { isAddress } from '@ethersproject/address';
import { BigNumber } from 'ethers';
import every from 'lodash/every';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import moment, { Moment } from 'moment';
import { TokenInfo } from './token';

export type VestMagnetDefinition = {
  type: "vest",
  recipient: string,
  startTime: Moment,
  cliffTime: Moment,
  endTime: Moment,
  lifetimeValue: BigNumber,
  token: TokenInfo
}

export type StreamMagnetDefinition = {
  type: "stream",
  recipient: string,
  startTime: Moment,
  endTime: Moment,
  lifetimeValue: BigNumber,
  token: TokenInfo
}

export type GiftMagnetDefinition = {
  type: "gift",
  recipient: string,
  sendTime: Moment,
  lifetimeValue: BigNumber,
  token: TokenInfo,
  giftName: string,
  giftMessage: string,
  giftImageUrl: string
}

export type MagnetDefinitionType = MagnetDefinition["type"];

type DefinitionDetails = {
  displayName: string
}

const MagnetDefinitionDetails : {[key in MagnetDefinitionType]: DefinitionDetails} = {
  vest: {
    displayName: "Vest"
  },
  stream: {
    displayName: "Stream"
  },
  gift: {
    displayName: "Gift"
  }
}

export const maybeGetMagnetTypeDisplayName = (magnetType: string) : string | undefined => {
  return (MagnetDefinitionDetails as any)[magnetType]?.displayName;
}

export type MagnetDefinition = VestMagnetDefinition | StreamMagnetDefinition | GiftMagnetDefinition;

type InProgress<K extends {type: MagnetDefinition["type"]}> = Partial<K> & { type: K["type"]};
export type InProgressVestMagnetDefinition = InProgress<VestMagnetDefinition>;
export type InProgressStreamMagnetDefinition = InProgress<StreamMagnetDefinition>;
export type InProgressGiftMagnetDefinition = InProgress<GiftMagnetDefinition>;
export type InProgressMagnetDefinition = InProgressVestMagnetDefinition | InProgressStreamMagnetDefinition | InProgressGiftMagnetDefinition;
export type RecurringMagnetDefinition = VestMagnetDefinition | StreamMagnetDefinition;

export const isVestMagnetDefinition = (value: any) : value is VestMagnetDefinition => {
  if (!isObject(value)) {
    return false;
  }
  const magnet = value as VestMagnetDefinition;
  return (
    magnet.type === "vest" &&
    moment.isMoment(magnet.cliffTime) &&
    moment.isMoment(magnet.endTime) &&
    BigNumber.isBigNumber(magnet.lifetimeValue) &&
    isString(magnet.recipient) && isAddress(magnet.recipient) &&
    moment.isMoment(magnet.startTime) &&
    isObject(magnet.token)
  );
};

export const isStreamMagnetDefinition = (value: any) : value is StreamMagnetDefinition => {
  if (!isObject(value)) {
    return false;
  }
  const magnet = value as StreamMagnetDefinition;
  return (
    magnet.type === "stream" &&
    moment.isMoment(magnet.endTime) &&
    BigNumber.isBigNumber(magnet.lifetimeValue) &&
    isString(magnet.recipient) && isAddress(magnet.recipient) &&
    moment.isMoment(magnet.startTime) &&
    isObject(magnet.token)
  );
};

export const isGiftMagnetDefinition = (value: any) : value is GiftMagnetDefinition => {
  if (!isObject(value)) {
    return false;
  }
  const magnet = value as GiftMagnetDefinition;
  return (
    magnet.type === "gift" &&
    isString(magnet.recipient) && isAddress(magnet.recipient) &&
    moment.isMoment(magnet.sendTime) &&
    BigNumber.isBigNumber(magnet.lifetimeValue) &&
    isObject(magnet.token) &&
    isString(magnet.giftName) &&
    isString(magnet.giftMessage) &&
    isString(magnet.giftImageUrl)
  );
};

export const isMagnetDefinition = (value: any) : value is MagnetDefinition => {
  return (
    isVestMagnetDefinition(value) ||
    isStreamMagnetDefinition(value) ||
    isGiftMagnetDefinition(value)
  );
}

export const areMagnetDefinitions = (values: any[]) : values is MagnetDefinition[] => {
  return every(values, isMagnetDefinition);
}
