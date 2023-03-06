import { ethers } from 'ethers';

const abi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		inputs: [],
		name: 'close',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'finishingTimes',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLeaderboardStats',
		outputs: [
			{ internalType: 'address[]', name: '', type: 'address[]' },
			{ internalType: 'uint256[]', name: '', type: 'uint256[]' },
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
		name: 'hasSolvedChallenge1',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
		name: 'hasSolvedChallenge2',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
		name: 'isOnLeaderboard',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isOpenFlag',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		name: 'leaderboard',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'open',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'previousSignature',
		outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
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
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'solvedChallenge1',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'solvedChallenge2',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'userWhoUsedSigner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
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
let RIDDLE_3_ETH_MESSAGE_HASH = '';

(async () => {
	try {
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
	} catch (error) {
		console.error(error);
	}
})();
