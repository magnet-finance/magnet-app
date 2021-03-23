export type TokenInfo = {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
}

export type Version = {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export type Tags = {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export type TokenList = {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly tokens: TokenInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
