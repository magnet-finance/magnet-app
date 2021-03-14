import { StreamMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';
import { getErc20ApproveTxn } from './erc20';

export const getStreamTxn = (magnet: StreamMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  const contract = contractManager.getSablierContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [
    // ERC20 Approve
    getErc20ApproveTxn(magnet.token, contract.address, amount, web3),
    // Sablier Create Stream
    {
      to: contract.address,
      value: Transaction.DEFAULT_VALUE,
      data: contract.interface.encodeFunctionData("createStream", [
        magnet.recipient,       // sablier.recipient
        amount,                 // sablier.deposit
        magnet.token.address,   // sablier.tokenAddress
        magnet.startTime.unix(),// sablier.startTime
        magnet.endTime.unix()   // sablier.startTime
      ])
    }
  ];
}
