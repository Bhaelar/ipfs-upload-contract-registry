"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abi = void 0;
exports.abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "string",
                name: "cid",
                type: "string",
            },
        ],
        name: "CIDStored",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "cid",
                type: "string",
            },
        ],
        name: "store",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
