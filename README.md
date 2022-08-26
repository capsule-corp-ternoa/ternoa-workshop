# 🦦 Ternoa Workshop

> ⚠️ This project is archived, it is no longer maintained.
> If you want to build on Ternoa use our [SDK ternoa-js](https://www.npmjs.com/package/ternoa-js) on Alphanet & Mainnet environements

Welcome,

This workshop will show how easy and fast building an NFT with the Ternoa JS SDK is.

## Installation

### [Node.js](https://nodejs.org/en/download/)

```bash
npm install ternoa-js
```

> This package provides TypeScript types, but you will need TypeScript version 4.2 or higher to use them properly.

## Documentation

The official SDK documentation is available: [ternoa-js sdk documentation](http://ternoa-js.ternoa.dev). Additional resources are available on the [ternoa official documentation](https://docs.ternoa.network/).

Discover our End-to-End Test dApp here to learn and test the Ternoa SDK : [ternoa-js-test-dapp](https://e2e.ternoa.network/).

### Cookbook example

If you are looking for a quick overview about the basic-usage of the Ternoa SDK, some explications or the best-practices, and how to create your first NFT, we recommand you to look at the exemple section [cookbook/basic-usage](https://github.com/capsule-corp-ternoa/ternoa-js/tree/1.1.0-basicNFTs-collections/examples/cookbook/basic-usage)

## Quick Start

An API instance must be initialize using the _initializeApi_ function in **ternoa-js/blockchain** before calling some SDK functions. The default chain endpoint is: `DEFAULT_CHAIN_ENDPOINT = "wss://alphanet.ternoa.com"`. It can be modified by passing a new endpoint as a parameter to the _initializeApi_ function.

Functions are organized by theme. In the example below, the import of _generateSeed_ and _getKeyringFromSeed_ from the subpath **ternoa-js/account** allows us to generate a new account and display its address.

```javascript
import { generateSeed, getKeyringFromSeed } from 'ternoa-js/account'
;(async () => {
  const account = await generateSeed()
  const keyring = await getKeyringFromSeed(account.seed)
  const address = keyring.address
  console.log('Your fresh public address is: ', address)
})().catch((e) => {
  console.log(e)
})
```

Among all the features provided by the Ternoa SDK, this short snippet of code allows you to create an NFT, submit and sign it at a glance. This single line _createNft_ function, require a few parameters : some `offchainData` metadatas, a `royalty`, a `collectionId` if you want this NFT to belong to a collection, a boolean to define its `isSoulbound` status, the `keyring` to sign and submit the transaction, and a `waitUntil` callback parameter, to define at which point we want to get the results of the transaction execution.

```javascript
import { createNft } from 'ternoa-js/nft'
import { generateSeed, getKeyringFromSeed } from 'ternoa-js/account'

const createMyFirstNFT = async () => {
  try {
    // We initialize an API instance connected to the Alphanet chain
    await initializeApi()

    // Here we create, sign and submit the NFT transaction with your keyring
    await createNft('My first NFT', 10, undefined, false, keyring, WaitUntil.BlockInclusion)
  } catch (e) {
    console.log(e)
  }
}
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Style

This project uses recommended ESLint and Typescript rules to ensure coding good practices.

We've setup linters and formatters to help catch errors and improve the development experience:

- [Prettier](https://prettier.io/) – ensures that code is formatted in a readable way.
- [ESLint](https://eslint.org/) — checks code for antipatterns as well as formatting.

[Husky](https://typicode.github.io/husky) proceeds some checks before pushing a new commit. It ensures that: the project is building, there are no linter/formatting issues and the test suites are not broken.

> If you use Visual Studio Code editor we suggest you to install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.
