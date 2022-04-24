"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const abi_1 = require("../abi/abi");
const web3_1 = __importDefault(require("web3"));
const goerliProvider = new web3_1.default.providers.HttpProvider("https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c");
const web3 = new web3_1.default(goerliProvider || web3_1.default.givenProvider);
const contractAddress = "0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3";
exports.command = "fetch-events <address>";
exports.desc = "List all CIDs for Ethereum address";
const builder = (yargs) => yargs.positional("address", { type: "string", demandOption: true });
exports.builder = builder;
const handler = async (argv) => {
    const { address } = argv;
    try {
        const contract = new web3.eth.Contract(abi_1.abi, contractAddress);
        const pastEvents = await contract.getPastEvents("CIDStored", {
            fromBlock: 0,
            toBlock: "latest",
        }, (error, event) => {
            if (error) {
                throw new Error(error);
            }
            return event;
        });
        const filtered = pastEvents.filter((event) => event.returnValues["0"] == address);
        console.log(filtered);
        process.exit(0);
    }
    catch (error) {
        throw new Error("Error occurred");
    }
};
exports.handler = handler;
