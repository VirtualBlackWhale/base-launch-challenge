import { ethers } from 'ethers';

const abi = [
	{
		inputs: [{ internalType: 'string', name: 'riddleAnswer', type: 'string' }],
		name: 'solveChallenge1',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'string', name: 'riddleAnswer', type: 'string' },
			{ internalType: 'bytes', name: 'signature', type: 'bytes' },
		],
		name: 'solveChallenge2',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'string', name: 'riddleAnswer', type: 'string' },
			{ internalType: 'address', name: 'signer', type: 'address' },
			{ internalType: 'bytes', name: 'signature', type: 'bytes' },
		],
		name: 'solveChallenge3',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

const PROVIDER = new ethers.providers.JsonRpcProvider(
	'https://chain-proxy.wallet.coinbase.com?targetName=base-goerli'
);

const WALLET = new ethers.Wallet('0xyour private key').connect(PROVIDER);

const CONTRACT = new ethers.Contract(
	'0xc1e40f9FD2bc36150e2711e92138381982988791',
	abi,
	WALLET
);
let RIDDLE_3_ETH_MESSAGE_HASH = '0x20a1626365cea00953c957fd02ddc4963990d404232d4e58acb66f46c59d9887';

(async () => {
	try {
		console.log('challenge accepted');
		
		await (await CONTRACT.solveChallenge1('faucet')).wait();

		const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('The Merge'));
		const sig = await WALLET.signMessage(ethers.utils.arrayify(hash));

		await (await CONTRACT.solveChallenge2('The Merge', sig)).wait();

		// any signature but must not have been used yet
		const randomSig =
			'0x7a768d10fe18b1563b69e8f138269d1c30646b553344b389cd27183cd92e4283699461494e48d7ed3559329c5ea869064808471e205ac31bb5d6e6107ac3aeef1b';
		const recoverAddress = ethers.utils.recoverAddress(
			RIDDLE_3_ETH_MESSAGE_HASH,
			randomSig
		);

		await (
			await CONTRACT.solveChallenge3('EIP-4844', recoverAddress, randomSig)
		).wait();
		
		console.log('challenge fulfilled');
	} catch (error) {
		console.error(error);
	}
})();
