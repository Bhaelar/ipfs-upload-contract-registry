import type { Arguments, CommandBuilder } from "yargs";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { abi } from "../abi/abi";
import { EventOptions, obj } from "../types/types";
import Web3 from "web3";

const goerliProvider = new Web3.providers.HttpProvider(
  "https://goerli.infura.io/v3/40861e6a38424fdeaf9888d011aa284c"
);
const web3 = new Web3(goerliProvider || Web3.givenProvider);

const contractAddress: string = "0x7Eb45FC38fc4E920fa124783eccc5765E1711Df3";

export const command: string = "fetch-events <address>";
export const desc: string = "List all CIDs for Ethereum address";

export const builder: CommandBuilder<EventOptions, EventOptions> = (yargs) =>
  yargs.positional("address", { type: "string", demandOption: true });

export const handler = async (argv: Arguments<EventOptions>): Promise<void> => {
  const { address } = argv;
  try {
    const contract: Contract = new web3.eth.Contract(abi as AbiItem[], contractAddress);

    const pastEvents: Array<obj> = await contract.getPastEvents(
      "CIDStored",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      (error: any, event: obj) => {
        if (error) {
          throw new Error(error);
        }
        return event;
      }
    );
    const filtered: Array<obj> = pastEvents.filter(
      (event: obj) => event.returnValues["0"] == address
    );
    console.log(filtered);
    process.exit(0);
  } catch (error) {
    throw new Error("Error occurred");
  }
};
