import type { Arguments, CommandBuilder } from "yargs";
import util from "util";
import fs from "fs";
import { create } from "ipfs-http-client";
import { Contract } from "web3-eth-contract";
import { abi } from "../abi/abi";
import { AbiItem } from "web3-utils";
import { UploadOptions, obj } from "../types/types";
import Web3 from "web3";

const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
});

const goerliProvider = new Web3.providers.HttpProvider(
  "https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c"
);
const web3 = new Web3(goerliProvider || Web3.givenProvider);
const account = "0xe66D0556C8a103adfa6C9a60018CD4D8AD78044C";
web3.eth.defaultAccount = account;
const privateKey: string =
  "b055716e0075e0f3da78e2f0752869abc7390c47fbf1030054b63af124291664";

const address: string = "0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3";

export const command: string = "upload <filePath>";
export const desc: string =
  "Upload filepath and stores CID in contract Registry";

export const builder: CommandBuilder<UploadOptions, UploadOptions> = (yargs) =>
  yargs.positional("filePath", { type: "string", demandOption: true });

export const handler = async (
  argv: Arguments<UploadOptions>
): Promise<void> => {
  const { filePath } = argv;
  const readFile = util.promisify(fs.readFile);
  try {
    const inputFile: Buffer = await readFile(filePath);
    const hash = await client.add(inputFile);
    const contract: Contract = new web3.eth.Contract(abi as AbiItem[], address);
    const data: string = contract.methods.store(hash.path).encodeABI();
    const nonce: number = await web3.eth.getTransactionCount(account, "latest");
    const txObject: obj = {
      nonce: nonce,
      to: address,
      value: web3.utils.toHex(web3.utils.toWei("0", "ether")),
      gasLimit: web3.utils.toHex(2100000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("6", "gwei")),
      data: data,
    };

    const signedTx: obj = await web3.eth.accounts.signTransaction(
      txObject,
      privateKey
    );

    if (!signedTx.rawTransaction) {
      throw new Error("Error occurred");
    }

    const result: obj = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error: Error, hash: string): string {
        if (error) {
          throw new Error(error.message);
        }
        return hash;
      }
    );

    const output = `🎉 The hash of your transaction is: ${result.transactionHash}`;
    process.stdout.write(output);

    process.exit(0);
  } catch (error) {
    throw new Error("Error occurred");
  }
};
