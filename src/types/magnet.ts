export type VestMagnetDefinition = {
  type: "vest",
  recipient: string,
  startTime: number,
  cliffTime: number,
  endTime: number,
  lifetimeValue: number
  tokenType: string
}

export type StreamMagnetDefinition = {
  type: "stream",
  recipient: string,
  startTime: number,
  endTime: number,
  lifetimeValue: number,
  tokenType: string
}

export type GiftMagnetDefinition = {
  type: "gift",
  recipient: string,
  sendTime: number,
  value: number,
  tokenType: string,
  giftName: string,
  giftMessage: string,
  giftImage: any
}

export type MagnetDefinition = VestMagnetDefinition | StreamMagnetDefinition | GiftMagnetDefinition;
export type InProgressMagnetDefinition = Partial<MagnetDefinition> & MagnetDefinition["type"];
