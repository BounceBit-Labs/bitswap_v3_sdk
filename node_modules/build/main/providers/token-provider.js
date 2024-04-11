"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WNATIVE_ON = exports.USDC_ON = exports.USDT_ON = exports.DAI_ON = exports.TokenProvider = exports.USDT_BIT_DEVNET = exports.UNI_GOERLI = exports.DAI_GOERLI = exports.WBTC_GOERLI = exports.USDT_GOERLI = exports.USDC_GOERLI = exports.DAI_SEPOLIA = exports.USDC_SEPOLIA = exports.LIDO_MAINNET = exports.AAVE_MAINNET = exports.UNI_MAINNET = exports.FEI_MAINNET = exports.DAI_MAINNET = exports.WBTC_MAINNET = exports.USDT_MAINNET = exports.USDC_MAINNET = void 0;
const abi_1 = require("@ethersproject/abi");
const strings_1 = require("@ethersproject/strings");
const sdk_core_1 = require("@uniswap/sdk-core");
const lodash_1 = __importDefault(require("lodash"));
const IERC20Metadata__factory_1 = require("../types/v3/factories/IERC20Metadata__factory");
const util_1 = require("../util");
// Some well known tokens on each chain for seeding cache / testing.
exports.USDC_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C');
exports.USDT_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD');
exports.WBTC_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin');
exports.FEI_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD');
exports.UNI_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', 18, 'UNI', 'Uniswap');
exports.AAVE_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', 18, 'AAVE', 'Aave Token');
exports.LIDO_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', 18, 'LDO', 'Lido DAO Token');
exports.USDC_SEPOLIA = new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', 18, 'USDC', 'USDC Token');
exports.DAI_SEPOLIA = new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, '0x7AF17A48a6336F7dc1beF9D485139f7B6f4FB5C8', 18, 'DAI', 'DAI Token');
exports.USDC_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0x07865c6e87b9f70255377e024ace6630c1eaa37f', 6, 'USDC', 'USD//C');
exports.USDT_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0xe583769738b6dd4e7caf8451050d1948be717679', 18, 'USDT', 'Tether USD');
exports.WBTC_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0xa0a5ad2296b38bd3e3eb59aaeaf1589e8d9a29a9', 8, 'WBTC', 'Wrapped BTC');
exports.DAI_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844', 18, 'DAI', 'Dai Stablecoin');
exports.UNI_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI', 'Uni token');
exports.USDT_BIT_DEVNET = new sdk_core_1.Token(sdk_core_1.ChainId.BIT_DEVNET, '0xe583769738b6dd4e7caf8451050d1948be717679', 18, 'TOKEN1', 'Token1');
class TokenProvider {
    constructor(chainId, multicall2Provider) {
        this.chainId = chainId;
        this.multicall2Provider = multicall2Provider;
    }
    async getTokenSymbol(addresses, providerConfig) {
        let result;
        let isBytes32 = false;
        try {
            result =
                await this.multicall2Provider.callSameFunctionOnMultipleContracts({
                    addresses,
                    contractInterface: IERC20Metadata__factory_1.IERC20Metadata__factory.createInterface(),
                    functionName: 'symbol',
                    providerConfig,
                });
        }
        catch (error) {
            util_1.log.error({ addresses }, `TokenProvider.getTokenSymbol[string] failed with error ${error}. Trying with bytes32.`);
            const bytes32Interface = new abi_1.Interface([
                {
                    inputs: [],
                    name: 'symbol',
                    outputs: [
                        {
                            internalType: 'bytes32',
                            name: '',
                            type: 'bytes32',
                        },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                },
            ]);
            try {
                result =
                    await this.multicall2Provider.callSameFunctionOnMultipleContracts({
                        addresses,
                        contractInterface: bytes32Interface,
                        functionName: 'symbol',
                        providerConfig,
                    });
                isBytes32 = true;
            }
            catch (error) {
                util_1.log.fatal({ addresses }, `TokenProvider.getTokenSymbol[bytes32] failed with error ${error}.`);
                throw new Error('[TokenProvider.getTokenSymbol] Impossible to fetch token symbol.');
            }
        }
        return { result, isBytes32 };
    }
    async getTokenDecimals(addresses, providerConfig) {
        return this.multicall2Provider.callSameFunctionOnMultipleContracts({
            addresses,
            contractInterface: IERC20Metadata__factory_1.IERC20Metadata__factory.createInterface(),
            functionName: 'decimals',
            providerConfig,
        });
    }
    async getTokens(_addresses, providerConfig) {
        const addressToToken = {};
        const symbolToToken = {};
        const addresses = (0, lodash_1.default)(_addresses)
            .map((address) => address.toLowerCase())
            .uniq()
            .value();
        if (addresses.length > 0) {
            const [symbolsResult, decimalsResult] = await Promise.all([
                this.getTokenSymbol(addresses, providerConfig),
                this.getTokenDecimals(addresses, providerConfig),
            ]);
            const isBytes32 = symbolsResult.isBytes32;
            const { results: symbols } = symbolsResult.result;
            const { results: decimals } = decimalsResult;
            for (let i = 0; i < addresses.length; i++) {
                const address = addresses[i];
                const symbolResult = symbols[i];
                const decimalResult = decimals[i];
                if (!(symbolResult === null || symbolResult === void 0 ? void 0 : symbolResult.success) || !(decimalResult === null || decimalResult === void 0 ? void 0 : decimalResult.success)) {
                    util_1.log.info({
                        symbolResult,
                        decimalResult,
                    }, `Dropping token with address ${address} as symbol or decimal are invalid`);
                    continue;
                }
                const symbol = isBytes32
                    ? (0, strings_1.parseBytes32String)(symbolResult.result[0])
                    : symbolResult.result[0];
                const decimal = decimalResult.result[0];
                addressToToken[address.toLowerCase()] = new sdk_core_1.Token(this.chainId, address, decimal, symbol);
                symbolToToken[symbol.toLowerCase()] =
                    addressToToken[address.toLowerCase()];
            }
            util_1.log.info(`Got token symbol and decimals for ${Object.values(addressToToken).length} out of ${addresses.length} tokens on-chain ${providerConfig ? `as of: ${providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.blockNumber}` : ''}`);
        }
        return {
            getTokenByAddress: (address) => {
                return addressToToken[address.toLowerCase()];
            },
            getTokenBySymbol: (symbol) => {
                return symbolToToken[symbol.toLowerCase()];
            },
            getAllTokens: () => {
                return Object.values(addressToToken);
            },
        };
    }
}
exports.TokenProvider = TokenProvider;
const DAI_ON = (chainId) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
            return exports.DAI_MAINNET;
        case sdk_core_1.ChainId.GOERLI:
            return exports.DAI_GOERLI;
        case sdk_core_1.ChainId.SEPOLIA:
            return exports.DAI_SEPOLIA;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.DAI_ON = DAI_ON;
const USDT_ON = (chainId) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
            return exports.USDT_MAINNET;
        case sdk_core_1.ChainId.GOERLI:
            return exports.USDT_GOERLI;
        case sdk_core_1.ChainId.BIT_DEVNET:
            return exports.USDT_BIT_DEVNET;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.USDT_ON = USDT_ON;
const USDC_ON = (chainId) => {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
            return exports.USDC_MAINNET;
        case sdk_core_1.ChainId.GOERLI:
            return exports.USDC_GOERLI;
        case sdk_core_1.ChainId.SEPOLIA:
            return exports.USDC_SEPOLIA;
        default:
            throw new Error(`Chain id: ${chainId} not supported`);
    }
};
exports.USDC_ON = USDC_ON;
const WNATIVE_ON = (chainId) => {
    return util_1.WRAPPED_NATIVE_CURRENCY[chainId];
};
exports.WNATIVE_ON = WNATIVE_ON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW4tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3Rva2VuLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUErQztBQUUvQyxvREFBNEQ7QUFDNUQsZ0RBQW1EO0FBQ25ELG9EQUF1QjtBQUV2QiwyRkFBd0Y7QUFDeEYsa0NBQXVEO0FBK0J2RCxvRUFBb0U7QUFDdkQsUUFBQSxZQUFZLEdBQUcsSUFBSSxnQkFBSyxDQUNuQyxrQkFBTyxDQUFDLE9BQU8sRUFDZiw0Q0FBNEMsRUFDNUMsQ0FBQyxFQUNELE1BQU0sRUFDTixRQUFRLENBQ1QsQ0FBQztBQUNXLFFBQUEsWUFBWSxHQUFHLElBQUksZ0JBQUssQ0FDbkMsa0JBQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLENBQUMsRUFDRCxNQUFNLEVBQ04sWUFBWSxDQUNiLENBQUM7QUFDVyxRQUFBLFlBQVksR0FBRyxJQUFJLGdCQUFLLENBQ25DLGtCQUFPLENBQUMsT0FBTyxFQUNmLDRDQUE0QyxFQUM1QyxDQUFDLEVBQ0QsTUFBTSxFQUNOLGFBQWEsQ0FDZCxDQUFDO0FBQ1csUUFBQSxXQUFXLEdBQUcsSUFBSSxnQkFBSyxDQUNsQyxrQkFBTyxDQUFDLE9BQU8sRUFDZiw0Q0FBNEMsRUFDNUMsRUFBRSxFQUNGLEtBQUssRUFDTCxnQkFBZ0IsQ0FDakIsQ0FBQztBQUNXLFFBQUEsV0FBVyxHQUFHLElBQUksZ0JBQUssQ0FDbEMsa0JBQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLEVBQUUsRUFDRixLQUFLLEVBQ0wsU0FBUyxDQUNWLENBQUM7QUFDVyxRQUFBLFdBQVcsR0FBRyxJQUFJLGdCQUFLLENBQ2xDLGtCQUFPLENBQUMsT0FBTyxFQUNmLDRDQUE0QyxFQUM1QyxFQUFFLEVBQ0YsS0FBSyxFQUNMLFNBQVMsQ0FDVixDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUcsSUFBSSxnQkFB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