## 🟦🟥 Magnet

[magnethq.io](https://magnethq.io/) is a workflow tool that makes it easy for a [Gnosis Safe](https://gnosis-safe.io/) Multisig to create and approve compensation packages.

You can...
1. Vest ERC20 tokens via [yearn vesting escrow](https://github.com/banteg/yearn-vesting-escrow)
2. Stream ERC20 tokens via [Sablier](https://github.com/sablierhq/sablier)
3. Grant ERC20 token bonuses via [yGift](https://github.com/yearn/ygift)

## Contracts
Magnet is a web UI that leverages existing smart contracts from the rockstar teams below.
| Contract        | Mainnet           | Rinkeby Testnet  |
| ------------- |-------------| -----|
| yearn-vesting-escrow      | 0xF124534bfa6Ac7b89483B401B4115Ec0d27cad6A | 0x2836925b66345e1c118ec87bbe44fce2e5a558f6 |
| Sablier      | 0xA4fc358455Febe425536fd1878bE67FfDBDEC59a      |   0xc04Ad234E01327b24a831e3718DBFcbE245904CC |
| yGift | 0x020171085bcd43b6FD36aD8C95aD61848B1211A2      |    0x7396352b217cd712a81463e5397f685e1a4965a1 |
| Gnosis MultiSend | 0x8D29bE29923b68abfDD21e541b9374737B49cdAD      |    0x8D29bE29923b68abfDD21e541b9374737B49cdAD |

## Feature backlog
Check out our [figma UX board](https://www.figma.com/file/pqukEVdFaa2DC8Dr7S0osz/Magnet-App-shared?node-id=0%3A1) for ideas!

* Glassdoor-style compensation features (e.g. top paying DAOs, top earning contributors)
* Withdrawal UI for contributors to claim their rewards
* ENS integration for address names and profile images
* Support more wallets beyond the current injected provider, via [web3react](https://github.com/NoahZinsmeister/web3-react)
* On the review page, display which multisig members have already approved or rejected the transactions

## Developer guide
Pull requests are warmly welcome! To get started, follow the steps below.
```
git clone https://github.com/magnet-finance/magnet-app
yarn install
yarn start
```

Then visit localhost:8000 in your browser
