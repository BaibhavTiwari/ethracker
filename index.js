require('dotenv').config();
const { Web3 } = require('web3');
const chalk = require('chalk');

const infuraUrl = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;

const web3 = new Web3(infuraUrl);

function formatTransactionDetails(transaction) {
  return {
    Hash: transaction.hash,
    'Block Number': transaction.blockNumber,
    From: transaction.from,
    To: transaction.to,
    Value: `${web3.utils.fromWei(transaction.value, 'ether')} ETH`,
    Gas: transaction.gas,
    'Gas Price': `${web3.utils.fromWei(transaction.gasPrice, 'gwei')} Gwei`,
    Nonce: transaction.nonce,
    'Input Data': transaction.input,
  };
}

function displayTransactionDetails(transaction) {
  const details = formatTransactionDetails(transaction);
  console.table(details);
}

async function getTransactionDetails(txHash) {
  try {
    if (!txHash || !web3.utils.isHexStrict(txHash)) {
      throw new Error('Invalid transaction hash.');
    }

    const transaction = await web3.eth.getTransaction(txHash);
    if (!transaction) {
      throw new Error('Transaction not found.');
    }

    displayTransactionDetails(transaction);
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }
}

const txHash = process.argv[2];
if (!txHash) {
  console.log(chalk.red('Please provide a transaction hash.'));
  process.exit(1);
}

getTransactionDetails(txHash);