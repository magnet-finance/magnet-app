import keys from "lodash/keys";

type ContractAddresses = {
  sablierContractAddress: string,
  yVestFactoryContractAddress: string,
  yGiftContractAddress: string,
  // Gnosis multi-send
  multiSendContractAddress: string,
};

const ContractAddressMap : {[key: number]: ContractAddresses} = {
  // Mainnet
  1: {
    sablierContractAddress: "0xA4fc358455Febe425536fd1878bE67FfDBDEC59a",
    yVestFactoryContractAddress: "0xF124534bfa6Ac7b89483B401B4115Ec0d27cad6A",
    yGiftContractAddress: "0x020171085bcd43b6FD36aD8C95aD61848B1211A2",
    multiSendContractAddress: ""
  },

  // Rinkeby
  4: {
    sablierContractAddress: "0xc04Ad234E01327b24a831e3718DBFcbE245904CC",
    yVestFactoryContractAddress: "0x2836925b66345e1c118ec87bbe44fce2e5a558f6",
    yGiftContractAddress: "0x7396352b217cd712a81463e5397f685e1a4965a1", // Note(ggranito): Minor contract differences from mainnet
    multiSendContractAddress: ""
  }
}

export const getContractAddresses = (chainId: number) : ContractAddresses => {
  const result = ContractAddressMap[chainId];
  if (result == null) {
    console.log(`Unsupported chainId: ${chainId}`)
    throw Error(`Unsupported chainId: ${chainId}`)
  }
  return result;
}

export const SUPPORTED_CHAINS = keys(ContractAddressMap)
