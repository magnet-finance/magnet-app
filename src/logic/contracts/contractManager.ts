import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import isNumber from "lodash/isNumber";
import memoize from "lodash/memoize";
import { TokenInfo } from "../../types/token";
import { Web3ReactContext } from "../../types/web3ReactContext";
import erc20Abi from './abi/erc20.json';
import gnosisMultiSendAbi from './abi/gnosisMultiSend.json';
import sablierAbi from './abi/sablier.json';
import yGiftAbi from './abi/yGift.json';
import yVestFactoryAbi from './abi/yVestFactory.json';

type ContractAddresses = {
  sablierContractAddress: string,
  yVestFactoryContractAddress: string,
  yGiftContractAddress: string,
  // Gnosis MultiSend v1.1.1 (for sending txn to gnosis)
  gnosisMultiSendContractAddress: string,
};

// Note: Wrap all literals with getAddress to ensure canonical form
const ContractAddressMap : {[key: number]: ContractAddresses} = {
  // Mainnet
  1: {
    sablierContractAddress: getAddress("0xA4fc358455Febe425536fd1878bE67FfDBDEC59a"),
    yVestFactoryContractAddress: getAddress("0xF124534bfa6Ac7b89483B401B4115Ec0d27cad6A"),
    yGiftContractAddress: getAddress("0x020171085bcd43b6FD36aD8C95aD61848B1211A2"),
    gnosisMultiSendContractAddress: getAddress("0x8D29bE29923b68abfDD21e541b9374737B49cdAD")
  },

  // Rinkeby
  4: {
    sablierContractAddress: getAddress("0xc04Ad234E01327b24a831e3718DBFcbE245904CC"),
    yVestFactoryContractAddress: getAddress("0x2836925b66345e1c118ec87bbe44fce2e5a558f6"),
    yGiftContractAddress: getAddress("0x7396352b217cd712a81463e5397f685e1a4965a1"), // Note(ggranito): Minor contract differences from mainnet
    gnosisMultiSendContractAddress: getAddress("0x8D29bE29923b68abfDD21e541b9374737B49cdAD")
  }
}

export type ContractManager = {
  chainId: number,
  contractAddresses: ContractAddresses,
  getSablierContract: () => Contract,
  getYVestFactoryContract: () => Contract,
  getYGiftContract: () => Contract,
  getGnosisMultiSendContract: () => Contract,
  getErc20Contract: (token: TokenInfo) => Contract
}

const _getContractManagerHelper = memoize((chainId: number) : ContractManager => {
  return {
    chainId,
    contractAddresses: ContractAddressMap[chainId],
    getSablierContract: memoize(() => new Contract(
      ContractAddressMap[chainId].sablierContractAddress,
      sablierAbi
    )),
    getYVestFactoryContract: memoize(() => new Contract(
      ContractAddressMap[chainId].yVestFactoryContractAddress,
      yVestFactoryAbi
    )),
    getYGiftContract: memoize(() => new Contract(
      ContractAddressMap[chainId].yGiftContractAddress,
      yGiftAbi
    )),
    getGnosisMultiSendContract: memoize(() => new Contract(
      ContractAddressMap[chainId].gnosisMultiSendContractAddress,
      gnosisMultiSendAbi
    )),
    getErc20Contract: memoize((token) => new Contract(
      token.address,
      erc20Abi
    ))
  }
})

export const getContractManager = (context?: Web3ReactContext | number) : ContractManager | undefined => {
  if (context == null) {
    return undefined;
  }
  let chainId : number | undefined;
  if (isNumber(context)) {
    chainId = context;
  } else {
    chainId = context.chainId
  }
  if (chainId == null || ContractAddressMap[chainId] == null) {
    return undefined;
  }
  return _getContractManagerHelper(chainId);
}
