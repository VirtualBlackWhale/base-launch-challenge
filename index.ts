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

(async () => {
	try {
		console.log('challenge accepted');

		await (await CONTRACT.solveChallenge1('faucet')).wait();

		const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('The Merge'));
		const sig = await WALLET.signMessage(ethers.utils.arrayify(hash));

		await (await CONTRACT.solveChallenge2('The Merge', sig)).wait();

		const hashChallenge3 = ethers.utils.keccak256(
			ethers.utils.toUtf8Bytes('EIP-4844')
		);
		const sigChallenge3 = await WALLET.signMessage(
			ethers.utils.arrayify(hashChallenge3)
		);

		await (
			await CONTRACT.solveChallenge3('EIP-4844', WALLET.address, sigChallenge3)
		).wait();

		const sigChallenge3Compact =
			ethers.utils.splitSignature(sigChallenge3).compact;

		await (
			await CONTRACT.solveChallenge3(
				'EIP-4844',
				WALLET.address,
				sigChallenge3Compact
			)
		).wait();

		console.log('challenge fulfilled');
	} catch (error) {
		console.error(error);
	}
})();
