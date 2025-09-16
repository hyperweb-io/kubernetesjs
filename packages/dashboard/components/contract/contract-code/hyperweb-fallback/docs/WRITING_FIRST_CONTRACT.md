# Writing Your First Contract

This guide walks you through creating a simple "Hello World" contract using Hyperweb. This contract will set an initial greeting message and provide a way to retrieve it.

## Prerequisites

Before starting, ensure you have:

- Set up the Hyperweb development environment (refer to the main [README](../README.md)).
- Basic understanding of TypeScript and object-oriented programming.

## Overview

Our "Hello World" contract will:

1. Set a greeting message when the contract is instantiated.
2. Provide a method to retrieve the message.

## Step 1: Create Your Contract Directory

1. Navigate to the `src/` directory.
2. Create a new folder named `hello-world`:

   ```bash
   mkdir src/hello-world
   ```

3. Inside the `hello-world` folder, create a file named `index.ts`:

   ```bash
   touch src/hello-world/index.ts
   ```

## Step 2: Implement the Hello World Contract

In `src/hello-world/index.ts`, define the contract as follows:

```ts
export interface State {
  get(key: string): string;
  set(key: string, value: any): void;
};

default export class HelloWorldContract {
    state: State;

    constructor(state: State) {
      this.state = state;
      this.state.set('greet', "Hello, World!"); // Set initial greeting in constructor
    }

    // Retrieve the greeting message
    greet(): string {
      return this.state.get('greet');
    }
}
```

### Explanation

- **Constructor**: Initializes the contract with the greeting message "Hello, World!".
- **`greet`**: Returns the message stored in the state.

## Step 3: Add the Contract to the Build Script

To include your contract in the build process:

1. Open `scripts/build.ts`.
2. Add an entry for the `hello-world` contract:

   ```ts
   const configs: BuildConfig[] = [
     // existing contracts
     {
       entryFile: "src/hello-world",
       outFile: "dist/contracts/helloWorld.js",
       externalPackages: [],
     },
   ];
   ```

This configuration specifies the entry point and output file for the build process.

## Step 4: Build the Contract

Compile the contract:

```bash
yarn build
```

This will generate the bundled contract in `dist/contracts`, making it ready for deployment.

## Step 5: Write Tests for the Hello World Contract

Testing helps ensure the contract behaves as expected. In the `__tests__/` directory:

1. Create `helloWorld.test.ts`:

   ```bash
   touch __tests__/helloWorld.test.ts
   ```

2. Write test cases for greeting retrieval:

   ```js
   import { Secp256k1HDWallet } from "@interchainjs/cosmos/wallets/secp256k1hd";
   import { assertIsDeliverTxSuccess } from "@interchainjs/cosmos/utils";

   import path from "path";
   import fs from "fs";
   import { getSigningJsdClient, jsd } from "hyperwebjs";
   import { useChain, generateMnemonic } from "starshipjs";
   import { sleep } from "../test-utils/sleep";
   import "./setup.test";

   describe("Hello World Contract Tests", () => {
     let wallet, denom, address, queryClient, signingClient;
     let chainInfo, getCoin, getRpcEndpoint, creditFromFaucet;
     let contractCode, contractIndex;

     let fee;

     beforeAll(async () => {
       ({ chainInfo, getCoin, getRpcEndpoint, creditFromFaucet } =
         useChain("hyperweb"));
       denom = (await getCoin()).base;

       // Initialize wallet
       wallet = Secp256k1HDWallet.fromMnemonic(generateMnemonic(), [
         {
           prefix: chainInfo.chain.bech32_prefix,
           hdPath: "m/44'/118'/0'/0/0",
         },
       ]);
       address = (await wallet.getAccounts())[0].address;
       console.log(`contract creator address: ${address}`);

       // Create custom cosmos interchain client
       queryClient = await jsd.ClientFactory.createRPCQueryClient({
         rpcEndpoint: await getRpcEndpoint(),
       });

       signingClient = await getSigningJsdClient({
         rpcEndpoint: await getRpcEndpoint(),
         signer: wallet,
       });

       // Set default fee
       fee = { amount: [{ denom, amount: "100000" }], gas: "550000" };

       await creditFromFaucet(address);
       await sleep(2000); // Wait for faucet transfer
     });

     it("check balance", async () => {
       const balance = await signingClient.getBalance(address, denom);
       expect(balance.amount).toEqual("10000000000");
       expect(balance.denom).toEqual(denom);
     });

     it("instantiate Hello World contract", async () => {
       // Read contract code from external file
       const contractPath = path.join(
         __dirname,
         "../dist/contracts/helloWorld.js"
       );
       contractCode = fs.readFileSync(contractPath, "utf8");

       const msg = jsd.jsd.MessageComposer.fromPartial.instantiate({
         creator: address,
         code: contractCode,
       });

       const result = await signingClient.signAndBroadcast(address, [msg], fee);
       assertIsDeliverTxSuccess(result);

       // Parse response to get the contract index
       const response = jsd.jsd.MsgInstantiateResponse.fromProtoMsg(
         result.msgResponses[0]
       );
       contractIndex = response.index;
       expect(contractIndex).toBeGreaterThan(0);
       console.log(`contract index: ${contractIndex}`);
     });

     it("query for initial greeting", async () => {
       const msg = jsd.jsd.MessageComposer.fromPartial.eval({
         creator: address,
         index: contractIndex,
         fnName: "greet",
         arg: "",
       });

       const result = await signingClient.signAndBroadcast(address, [msg], fee);
       assertIsDeliverTxSuccess(result);

       const response = jsd.jsd.MsgEvalResponse.fromProtoMsg(
         result.msgResponses[0]
       );
       expect(response.result).toEqual("Hello, World!");
     });
   });
   ```

3. Run the tests:

   ```bash
   yarn test
   ```

## Step 6: Deploy and Interact with the Contract

With the contract built and tested, you can now deploy it to the Hyperweb blockchain:

1. **Deploy**: Use Hyperweb’s deployment tools to deploy your contract.
2. **Interact**: Call the `greet` method to retrieve the greeting message from the deployed contract.

## Summary

You've successfully created, built, tested, and deployed a simple "Hello World" contract using Hyperweb.
This foundational contract will help as you move on to more complex contracts.
For further information, refer to the Hyperweb documentation.
