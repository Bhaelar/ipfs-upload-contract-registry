# ipfs-upload-contract-registry
This application provides a feature to upload a file to IPFS and then store the CID in this [smart contract](https://goerli.etherscan.io/address/0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3).

All CIDS stored for a particular Ethereum address can also be retrieved.

## Running the application
- After downloading the source code, run `npm install` to install all dependencies
- Navigate to the build folder with `cd build`
- To Upload a file to IPFS, enter `node cli upload <filePath>`. `<filePath>` is the path of a file on your computer that you wish to upload to IPFS.
- If successful, the following message is logged on the terminal: `The hash of your transaction is: <transactionHash>`. Else, an error message is displayed
- To print all `CIDStored` events pertaining an address, enter `node cli fetch-events <address>`. `<address>` is a valid ethereum address
- If successful, an array of events is displayed. Else, an error message gets displayed
