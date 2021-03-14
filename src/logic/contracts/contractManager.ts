import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from '@ethersproject/providers';
import memoize from "lodash/memoize";
import { Web3ReactContext } from "../../types/web3ReactContext";
import gnosisMultiSendAbi from './abi/gnosisMultiSend.json';
import multiSendAbi from './abi/multiSend.json';
import sablierAbi from './abi/sablier.json';
import yGiftAbi from './abi/yGift.json';
import yVestFactoryAbi from './abi/yVestFactory.json';

type ContractAddresses = {
  sablierContractAddress: string,
  yVestFactoryContractAddress: string,
  yGiftContractAddress: string,
  // MultiSendContract: (Gnosis MultiSend v1.1.0 for executing immediately)
  multiSendContractAddress: string,
  // Gnosis MultiSend v1.1.1 (for sending txn to gnosis)
  gnosisMultiSendContractAddress: string,
};

const ContractAddressMap : {[key: number]: ContractAddresses} = {
  // Mainnet
  1: {
    sablierContractAddress: "0xA4fc358455Febe425536fd1878bE67FfDBDEC59a",
    yVestFactoryContractAddress: "0xF124534bfa6Ac7b89483B401B4115Ec0d27cad6A",
    yGiftContractAddress: "0x020171085bcd43b6FD36aD8C95aD61848B1211A2",
    multiSendContractAddress: "0xB522a9f781924eD250A11C54105E51840B138AdD",
    gnosisMultiSendContractAddress: "0x8D29bE29923b68abfDD21e541b9374737B49cdAD"
  },

  // Rinkeby
  4: {
    sablierContractAddress: "0xc04Ad234E01327b24a831e3718DBFcbE245904CC",
    yVestFactoryContractAddress: "0x2836925b66345e1c118ec87bbe44fce2e5a558f6",
    yGiftContractAddress: "0x7396352b217cd712a81463e5397f685e1a4965a1", // Note(ggranito): Minor contract differences from mainnet
    multiSendContractAddress: "0xB522a9f781924eD250A11C54105E51840B138AdD",
    gnosisMultiSendContractAddress: "0x8D29bE29923b68abfDD21e541b9374737B49cdAD"
  }
}

export type ContractManager = {
  chainId: number,
  contractAddresses: ContractAddresses,
  getSablierContract: () => Contract,
  getYVestFactoryContract: () => Contract,
  getYGiftContract: () => Contract,
  getMultiSendContract: () => Contract,
  getGnosisMultiSendContract: () => Contract
}

const _getContractManagerHelper = memoize((chainId: number, provider: Web3Provider) : ContractManager => {
  return {
    chainId,
    contractAddresses: ContractAddressMap[chainId],
    getSablierContract: memoize(() => new Contract(
      ContractAddressMap[chainId].sablierContractAddress,
      sablierAbi,
      provider
    )),
    getYVestFactoryContract: memoize(() => new Contract(
      ContractAddressMap[chainId].yVestFactoryContractAddress,
      yVestFactoryAbi,
      provider
    )),
    getYGiftContract: memoize(() => new Contract(
      ContractAddressMap[chainId].yGiftContractAddress,
      yGiftAbi,
      provider
    )),
    getMultiSendContract: memoize(() => new Contract(
      ContractAddressMap[chainId].multiSendContractAddress,
      multiSendAbi,
      provider
    )),
    getGnosisMultiSendContract: memoize(() => new Contract(
      ContractAddressMap[chainId].gnosisMultiSendContractAddress,
      gnosisMultiSendAbi,
      provider
    )),
  }
})

export const getContractManager = (web3: Web3ReactContext) : ContractManager | undefined => {
  if (web3 == null || web3.library == null) {
    return undefined;
  }
  const chainId = web3.chainId;
  const provider = web3.library;
  if (chainId == null || ContractAddressMap[chainId] == null || provider == null) {
    return undefined;
  }
  return _getContractManagerHelper(chainId, provider);
}
