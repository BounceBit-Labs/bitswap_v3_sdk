"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeOnChain = exports.ExtendedEther = exports.WRAPPED_NATIVE_CURRENCY = exports.ID_TO_PROVIDER = exports.CHAIN_IDS_LIST = exports.ID_TO_NETWORK_NAME = exports.NATIVE_CURRENCY = exports.NATIVE_NAMES_BY_ID = exports.NativeCurrencyName = exports.ChainName = exports.ID_TO_CHAIN_ID = exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = exports.HAS_L1_FEE = exports.V2_SUPPORTED = exports.SUPPORTED_CHAINS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
// WIP: Gnosis, Moonbeam
exports.SUPPORTED_CHAINS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.BIT_DEVNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
    // Gnosis and Moonbeam don't yet have contracts deployed yet
];
exports.V2_SUPPORTED = [sdk_core_1.ChainId.MAINNET, sdk_core_1.ChainId.GOERLI, sdk_core_1.ChainId.SEPOLIA];
exports.HAS_L1_FEE = [];
exports.NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
];
const ID_TO_CHAIN_ID = (id) => {
    switch (id) {
        case 1:
            return sdk_core_1.ChainId.MAINNET;
        case 5:
            return sdk_core_1.ChainId.GOERLI;
        case 11155111:
            return sdk_core_1.ChainId.SEPOLIA;
        case 6000:
            return sdk_core_1.ChainId.BIT_DEVNET;
        default:
            throw new Error(`Unknown chain id: ${id}`);
    }
};
exports.ID_TO_CHAIN_ID = ID_TO_CHAIN_ID;
var ChainName;
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
})(ChainName = exports.ChainName || (exports.ChainName = {}));
var NativeCurrencyName;
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
})(NativeCurrencyName = exports.NativeCurrencyName || (exports.NativeCurrencyName = {}));
exports.NATIVE_NAMES_BY_ID = {
    [sdk_core_1.ChainId.MAINNET]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.GOERLI]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.SEPOLIA]: [
        'ETH',
        'ETHER',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
    [sdk_core_1.ChainId.BIT_DEVNET]: [
        'BB',
        'BOUNCEBIT',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ],
};
exports.NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.GOERLI]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.SEPOLIA]: NativeCurrencyName.ETHER,
    [sdk_core_1.ChainId.BIT_DEVNET]: NativeCurrencyName.BOUNCEBIT
};
const ID_TO_NETWORK_NAME = (id) => {
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
exports.ID_TO_NETWORK_NAME = ID_TO_NETWORK_NAME;
exports.CHAIN_IDS_LIST = Object.values(sdk_core_1.ChainId).map((c) => c.toString());
const ID_TO_PROVIDER = (id) => {
    switch (id) {
        case sdk_core_1.ChainId.MAINNET:
            return process.env.JSON_RPC_PROVIDER;
        case sdk_core_1.ChainId.GOERLI:
            return process.env.JSON_RPC_PROVIDER_GORLI;
        case sdk_core_1.ChainId.SEPOLIA:
            return process.env.JSON_RPC_PROVIDER_SEPOLIA;
        case sdk_core_1.ChainId.BIT_DEVNET:
            return process.env.JSON_RPC_PROVIDER_BIT_DEVNET;
        default:
            throw new Error(`Chain id: ${id} not supported`);
    }
};
exports.ID_TO_PROVIDER = ID_TO_PROVIDER;
exports.WRAPPED_NATIVE_CURRENCY = {
    [sdk_core_1.ChainId.MAINNET]: new sdk_core_1.Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.GOERLI]: new sdk_core_1.Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(11155111, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BIT_DEVNET]: new sdk_core_1.Token(6000, '0x2Fe2C332E5F72F0AC76e82BaDD8261B8FbcFDFe3', 18, 'WBB', 'Wrapped BB'),
};
class ExtendedEther extends sdk_core_1.Ether {
    get wrapped() {
        if (this.chainId in exports.WRAPPED_NATIVE_CURRENCY) {
            return exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        }
        throw new Error('Unsupported chain ID');
    }
    static onChain(chainId) {
        var _a;
        return ((_a = this._cachedExtendedEther[chainId]) !== null && _a !== void 0 ? _a : (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)));
    }
}
exports.ExtendedEther = ExtendedEther;
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId] != undefined) {
        return cachedNativeCurrency[chainId];
    }
    cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId);
    return cachedNativeCurrency[chainId];
}
exports.nativeOnChain = nativeOnChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhaW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWwvY2hhaW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUsyQjtBQUUzQix3QkFBd0I7QUFDWCxRQUFBLGdCQUFnQixHQUFjO0lBQ3pDLGtCQUFPLENBQUMsT0FBTztJQUNmLGtCQUFPLENBQUMsVUFBVTtJQUNsQixrQkFBTyxDQUFDLE1BQU07SUFDZCxrQkFBTyxDQUFDLE9BQU87SUFFZiw0REFBNEQ7Q0FDN0QsQ0FBQztBQUVXLFFBQUEsWUFBWSxHQUFHLENBQUMsa0JBQU8sQ0FBQyxPQUFPLEVBQUUsa0JBQU8sQ0FBQyxNQUFNLEVBQUUsa0JBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVsRSxRQUFBLFVBQVUsR0FBYSxFQUNuQyxDQUFDO0FBRVcsUUFBQSxvQ0FBb0MsR0FBRztJQUNsRCxrQkFBTyxDQUFDLE9BQU87SUFDZixrQkFBTyxDQUFDLE1BQU07Q0FDZixDQUFDO0FBRUssTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFVLEVBQVcsRUFBRTtJQUNwRCxRQUFRLEVBQUUsRUFBRTtRQUNWLEtBQUssQ0FBQztZQUNKLE9BQU8sa0JBQU8sQ0FBQyxPQUFPLENBQUM7UUFDekIsS0FBSyxDQUFDO1lBQ0osT0FBTyxrQkFBTyxDQUFDLE1BQU0sQ0FBQztRQUN4QixLQUFLLFFBQVE7WUFDWCxPQUFPLGtCQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3pCLEtBQUssSUFBSTtZQUNMLE9BQU8sa0JBQU8sQ0FBQyxVQUFVLENBQUM7UUFDOUI7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzlDO0FBQ0gsQ0FBQyxDQUFDO0FBYlcsUUFBQSxjQUFjLGtCQWF6QjtBQUVGLElBQVksU0FtQlg7QUFuQkQsV0FBWSxTQUFTO0lBQ25CLGdDQUFtQixDQUFBO0lBQ25CLDhCQUFpQixDQUFBO0lBQ2pCLGdDQUFt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