"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const ipfs_http_client_1 = require("ipfs-http-client");
const abi_1 = require("../abi/abi");
const web3_1 = __importDefault(require("web3"));
const client = (0, ipfs_http_client_1.create)({
    url: "https://ipfs.infura.io:5001/api/v0",
});
const goerliProvider = new web3_1.default.providers.HttpProvider("https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c");
const web3 = new web3_1.default(goerliProvider || web3_1.default.givenProvider);
const account = "0xe66D0556C8a103adfa6C9a60018CD4D8AD78044C";
web3.eth.defaultAccount = account;
const privateKey = "b055716e0075e0f3da78e2f0752869abc7390c47fbf1030054b63af124291664";
const address = "0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3";
exports.command = "upload <filePath>";
exports.desc = "Upload filepath and stores CID in contract Registry";
const builder = (yargs) => yargs.positional("filePath", { type: "string", demandOption: true });
exports.builder = builder;
const handler = async (argv) => {
    const { filePath } = argv;
    const readFile = util_1.default.promisify(fs_1.default.readFile);
    try {
        const inputFile = await readFile(filePath);
        const hash = await client.add(inputFile);
        const contract = new web3.eth.Contract(abi_1.abi, address);
        const data = contract.methods.store(hash.path).encodeABI();
        const nonce = await web3.eth.getTransactionCount(account, "latest");
        const txObject = {
            nonce: nonce,
            to: address,
            value: web3.utils.toHex(web3.utils.toWei("0", "ether")),
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei("6", "gwei")),
            data: data,
        };
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
        if (!signedTx.rawTransaction) {
            throw new Error("Error occurred");
        }
        const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
            if (error) {
                throw new Error(error.message);
            }
            return hash;
        });
        const output = `🎉 The hash of your transaction is: ${result.transactionHash}`;
        process.stdout.write(output);
        process.exit(0);
    }
    catch (error) {
        throw new Error("Error occurred");
    }
};
exports.handler = handler;
