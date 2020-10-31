const HDWalletProvider = require("truffle-hdwallet-provider")
const zokratesProof = [
    require("./proofs/proof_1.json"),
    require("./proofs/proof_2.json"),
    require("./proofs/proof_3.json"),
    require("./proofs/proof_4.json"),
    require("./proofs/proof_5.json"),
    require("./proofs/proof_6.json"),
    require("./proofs/proof_7.json"),
    require("./proofs/proof_8.json"),
    require("./proofs/proof_9.json"),
    require("./proofs/proof_10.json")
];

const web3 = require('web3');
const fs = require('fs');


const MNEMONIC = fs.readFileSync("eth-contracts/.secret").toString().trim();

const INFURA_KEY = "a0d3244997ec4d9485c494af9add2c54";
const CONTRACT_ADDRESS = "0xDBB7E9F92f0Ec78EFb71D12D3ea13E587f104aF1";
const OWNER_ADDRESS = "0x126e23E44067EeF8bC3BeBBE34aEdf16060C7132";
const NETWORK = "rinkeby";

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const contract = require('../eth-contracts/build/contracts/SolnSquareVerifier.json');
const ABI = contract.abi;

async function mint() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (CONTRACT_ADDRESS) {
        const grToken = new web3Instance.eth.Contract(ABI, CONTRACT_ADDRESS, {gasLimit: "1000000"})
        // tokens issued directly to the owner.
        for (let i = 0; i < zokratesProof.length; i++) {
            let j = 3 + i;
            try {
                let proofs = Object.values(zokratesProof[j].proof);
                let inputs = zokratesProof[j].inputs;
                console.log("OWNER_ADDRESS " + OWNER_ADDRESS + "\n");
                console.log("i " + j + "\n");
                console.log("proofs " + proofs + "\n");
                console.log("inputs " + inputs + "\n");
                let tx = await grToken.methods.addSolution(OWNER_ADDRESS, j, ...proofs, inputs).send({from: OWNER_ADDRESS});
                console.log("Solution added. Transaction: " + tx.transactionHash);
                tx = await grToken.methods.mint(OWNER_ADDRESS, j).send({from: OWNER_ADDRESS});
                console.log("Minted item. Transaction: " + tx.transactionHash);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

mint();
