import { BigNumber } from 'ethers';
import { Moment } from 'moment';

export type VestMagnetDefinition = {
  type: "vest",
  recipient: string,
  startTime: Moment,
  cliffTime: Moment,
  endTime: Moment,
  lifetimeValue: BigNumber
  tokenType: string
}

export type StreamMagnetDefinition = {
  type: "stream",
  recipient: string,
  startTime: Moment,
  endTime: Moment,
  lifetimeValue: BigNumber,
  tokenType: string
}

export type GiftMagnetDefinition = {
  type: "gift",
  recipient: string,
  sendTime: Moment,
  lifetimeValue: BigNumber,
  tokenType: string,
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
