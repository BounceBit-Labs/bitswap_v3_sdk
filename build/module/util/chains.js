import { ChainId, Ether, Token, } from '@uniswap/sdk-core';
// WIP: Gnosis, Moonbeam
export const SUPPORTED_CHAINS = [
    ChainId.MAINNET,
    ChainId.BIT_DEVNET,
    ChainId.GOERLI,
    ChainId.SEPOLIA,
    // Gnosis and Moonbeam don't yet have contracts deployed yet
];
export const V2_SUPPORTED = [ChainId.MAINNET, ChainId.GOERLI, ChainId.SEPOLIA];
export const HAS_L1_FEE = [];
export const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    ChainId.MAINNET,
    ChainId.GOERLI,
];
export const ID_TO_CHAIN_ID = (id) => {
    switch (id) {
        case 1:
            return ChainId.MAINNET;
        case 5:
            return ChainId.GOERLI;
        case 11155111:
            return ChainId.SEPOLIA;
        case 6000:
            return ChainId.BIT_DEVNET;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
export var ChainName;
(function (ChainName) {
    ChainName["MAINNET"] = "mainnet";
    ChainName["GOERLI"] = "goerli";
    ChainName["SEPOLIA"] = "sepolia";
    ChainName["OPTIMISM"] = "optimism-mainnet";
    ChainName["OPTIMISM_GOERLI"] = "optimism-goerli";
    ChainName["ARBITRUM_ONE"] = "arbitrum-mainnet";
    ChainName["ARBITRUM_GOERLI"] = "arbitrum-goerli";
    ChainName["POLYGON"] = "polygon-mainnet";
    ChainName["POLYGON_MUMBAI"] = "polygon-mumbai";
    ChainName["CELO"] = "celo-mainnet";
    ChainName["CELO_ALFAJORES"] = "celo-alfajores";
    ChainName["GNOSIS"] = "gnosis-mainnet";
    ChainName["MOONBEAM"] = "moonbeam-mainnet";
    ChainName["BNB"] = "bnb-mainnet";
    ChainName["AVALANCHE"] = "avalanche-mainnet";
    ChainName["BASE"] = "base-mainnet";
    ChainName["BASE_GOERLI"] = "base-goerli";
    ChainName["BIT_DEVNET"] = "bounce-bit";
})(ChainName || (ChainName = {}));
export var NativeCurrencyName;
(function (NativeCurrencyName) {
    // Strings match input for CLI
    NativeCurrencyName["ETHER"] = "ETH";
    NativeCurrencyName["MATIC"] = "MATIC";
    NativeCurrencyName["CELO"] = "CELO";
    NativeCurrencyName["GNOSIS"] = "XDAI";
    NativeCurrencyName["MOONBEAM"] = "GLMR";
    NativeCurrencyName["BNB"] = "BNB";
    NativeCurrencyName["AVALANCHE"] = "AVAX";
    NativeCurrencyName["BOUNCEBIT"] = "BOUNCEBIT";
})(NativeCurrencyName || (NativeCurrencyName = {}));
export const NATIVE_NAMES_BY_ID = {
    [ChainId.MAINNET]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [ChainId.GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [ChainId.SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [ChainId.BIT_DEVNET]: [
        'BB',
        'BOUNCEBIT',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
};
export const NATIVE_CURRENCY = {
    [ChainId.MAINNET]: NativeCurrencyName.ETHER,
    [ChainId.GOERLI]: NativeCurrencyName.ETHER,
    [ChainId.SEPOLIA]: NativeCurrencyName.ETHER,
    [ChainId.BIT_DEVNET]: NativeCurrencyName.BOUNCEBIT
};
export const ID_TO_NETWORK_NAME = (id) => {
    switch (id) {
        case 1:
            return ChainName.MAINNET;
        case 5:
            return ChainName.GOERLI;
        case 11155111:
            return ChainName.SEPOLIA;
        case 6000:
            return ChainName.BIT_DEVNET;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
export const CHAIN_IDS_LIST = Object.values(ChainId).map((c) => c.toString());
export const ID_TO_PROVIDER = (id) => {
    switch (id) {
        case ChainId.MAINNET:
            return process.env.JSON_RPC_PROVIDER;
        case ChainId.GOERLI:
            return process.env.JSON_RPC_PROVIDER_GORLI;
        case ChainId.SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_SEPOLIA;
        case ChainId.BIT_DEVNET:
            return process.env.JSON_RPC_PROVIDER_BIT_DEVNET;
        default:
            throw new Error(`Chain id: ${id} not supported`);
    }
};
export const WRAPPED_NATIVE_CURRENCY = {
    [ChainId.MAINNET]: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [ChainId.GOERLI]: new Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [ChainId.SEPOLIA]: new Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [ChainId.BIT_DEVNET]: new Token(6000, '0x2Fe2C332E5F72F0AC76e82BaDD8261B8FbcFDFe3', 18, 'WBB', 'Wrapped BB'),
};
export class ExtendedEther extends Ether {
    get wrapped() {
        if (this.chainId in WRAPPED_NATIVE_CURRENCY) {
            return WRAPPED_NATIVE_CURRENCY[this.chainId];
        }
        throw new Error('Unsupported chain ID');
    }
    static onChain(chainId) {
        var _a;
        return ((_a = this._cachedExtendedEther[chainId]) !== null && _a !== void 0 ? _a : (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)));
    }
}
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
export function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId] != undefined) {
        return cachedNativeCurrency[chainId];
    }
    cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
    return cachedNativeCurrency[chainId];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY2hhaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUVMLEtBQUssR0FDTixNQUFNLG1CQUFtQixDQUFDO0FBRTNCLHdCQUF3QjtBQUN4QixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBYztJQUN6QyxPQUFPLENBQUMsT0FBTztJQUNmLE9BQU8sQ0FBQyxVQUFVO0lBQ2xCLE9BQU8sQ0FBQyxNQUFNO0lBQ2QsT0FBTyxDQUFDLE9BQU87SUFFZiw0REFBNEQ7Q0FDN0QsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFL0UsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFhLEVBQ25DLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxvQ0FBb0MsR0FBRztJQUNsRCxPQUFPLENBQUMsT0FBTztJQUNmLE9BQU8sQ0FBQyxNQUFNO0NBQ2YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQVUsRUFBVyxFQUFFO0lBQ3BELFFBQVEsRUFBRSxFQUFFO1FBQ1YsS0FBSyxDQUFDO1lBQ0osT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3pCLEtBQUssQ0FBQztZQUNKLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN4QixLQUFLLFFBQVE7WUFDWCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDekIsS0FBSyxJQUFJO1lBQ0wsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQzlCO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QztBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBTixJ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