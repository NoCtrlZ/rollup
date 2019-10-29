/* eslint-disable no-restricted-syntax */
const ethers = require('ethers');
const { Wallet } = require('../../wallet.js');
const CliExternalOperator = require('../../../../rollup-operator/src/cli-external-operator');
/**
 * @dev withdraw on-chain transaction to get retrieve the users balance from exit tree
 * before this call an off-chain transaction must be done to Id 0 or a onchain forceWithdraw
 * that transactions will build a leaf on exit tree
 * @param urlNode URL of the ethereum node
 * @param addressSC rollup address
 * @param balance amount to retrieve
 * @param tokenId token type
 * @param walletJson from this one can obtain the ethAddress and babyPubKey
 * @param password for decrypt the Wallet
 * @param abi abi of rollup contract'
 * @param urlOperator URl from operator
 * @param idFrom balance tree identifier
 * @param numExitRoot exit tree root depth to look for exit tree leaf
 */
async function withdraw(urlNode, addressSC, balance, walletJson, password, abi, urlOperator, idFrom, numExitRoot) {
    const apiOperator = new CliExternalOperator(urlOperator);
    const walletRollup = await Wallet.fromEncryptedJson(walletJson, password);
    let walletEth = walletRollup.ethWallet.wallet;
    const provider = new ethers.providers.JsonRpcProvider(urlNode);
    walletEth = walletEth.connect(provider);
    const contractWithSigner = new ethers.Contract(addressSC, abi, walletEth);

    try {
        const res = await apiOperator.getExitInfo(numExitRoot, idFrom);
        const infoExitTree = res.data;
        if (infoExitTree.found) {
            return await contractWithSigner.withdraw(infoExitTree.state.idx, balance, numExitRoot,
                infoExitTree.state.nonce, infoExitTree.siblings);
        }
        throw new Error(`No exit tree leaf was found in batch: ${numExitRoot} with id: ${idFrom}`);
    } catch (error) {
        throw new Error(`Message error: ${error.message}`);
    }
}

module.exports = {
    withdraw,
};
