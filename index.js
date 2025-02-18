require('dotenv').config();
const { Web3 } = require('web3');
const chalk = require('chalk');

const infuraApiKey = process.env.INFURA_API_KEY;

if (!infuraApiKey) {
  console.error('Infura API key is missing. Please set INFURA_API_KEY in your .env file.');
  process.exit(1);
}

const providerUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`;
const web3 = new Web3(providerUrl);

async function getTransactionDetails(txHash) {
  try {

    const transaction = await web3.eth.getTransaction(txHash);

    if (!transaction) {
      console.log('Transaction not found.');
      return;
    }

    const receipt = await web3.eth.getTransactionReceipt(txHash);

    if (!receipt) {
      console.log('Transaction receipt not found.');
      return;
    }

    const transactionDetails = {
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


    const receiptDetails = {
      'Transaction Status': receipt.status ? 'Success' : 'Failure',
      'Contract Address': receipt.contractAddress || 'N/A',
      'Logs Count': receipt.logs.length,
    };

    console.log('Transaction Details:');
    console.table(transactionDetails);

    console.log('Transaction Receipt:');
    console.table(receiptDetails);

  } catch (error) {
    console.error('Error fetching transaction details:', error.message);
  }
}

const txHash = process.argv[2];

if (!txHash) {
  console.log('Please provide a transaction hash.');
  process.exit(1);
}

getTransactionDetails(txHash);