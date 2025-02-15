require('dotenv').config();
const { Web3 } = require('web3');

const infuraApiKey = process.env.INFURA_API_KEY;

const provideUrl = `https://mainnet.infura.io/v3/${infuraApiKey}`;

const web3 = new Web3(provideUrl);

async function getTransactionDetails(txHash){
  try {
    const transaction = await web3.eth.getTransaction(txHash);

    if(!transaction) {
      console.log('Transaction not Found.');
      return;
    }

    const transactionDetails = {
      Hash: transaction.hash,
      'Block Number' : transaction.blockNumber,
      From: transaction.from,
      To : transaction.to,
      Value: `${web3.utils.fromWei(transaction.value, 'ether')} ETH`,
      Gas: transaction.gas,
      'Gas Price': `${web3.utils.fromWei(transaction.gasPrice, 'gwei')} Gwei`,
      Nonce: transaction.nonce,
      'Input Data' : transaction.input,
      };

    console.table(transactionDetails);  
  }
}

const txHash = process.argv[2];
if(!txHash) {
  console.log('please provide a transaction Hash.');
  process.exit(1);
}

gettransactionDetails(txHash);