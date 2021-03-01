import { Moment } from 'moment';

export type VestMagnetDefinition = {
  type: "vest",
  recipient: string,
  startTime: Moment,
  cliffTime: Moment,
  endTime: Moment,
  lifetimeValue: number
  tokenType: string
}

export type StreamMagnetDefinition = {
  type: "stream",
  recipient: string,
  startTime: Moment,
  endTime: Moment,
  lifetimeValue: number,
  tokenType: string
}

export type GiftMagnetDefinition = {
  type: "gift",
  recipient: string,
  sendTime: Moment,
  giftValue: number,
  tokenType: string,
  giftName: string,
  giftMessage: string,
  giftImageUrl: string
}

export type MagnetDefinition = VestMagnetDefinition | StreamMagnetDefinition | GiftMagnetDefinition;
export type InProgressMagnetDefinition = Partial<MagnetDefinition> & { type: MagnetDefinition["type"]};
