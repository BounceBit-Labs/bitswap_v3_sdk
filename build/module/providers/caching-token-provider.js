import { ChainId, Token } from '@uniswap/sdk-core';
import _ from 'lodash';
import { log, WRAPPED_NATIVE_CURRENCY } from '../util';
import { BTC_BIT_MAINNET, DAI_MAINNET, USD_BIT_MAINNET, USDC_MAINNET, USDC_SEPOLIA, USDT_MAINNET, WBTC_MAINNET, } from './token-provider';
// These tokens will added to the Token cache on initialization.
export const CACHE_SEED_TOKENS = {
    [ChainId.MAINNET]: {
        WETH: WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET],
        USDC: USDC_MAINNET,
        USDT: USDT_MAINNET,
        WBTC: WBTC_MAINNET,
        DAI: DAI_MAINNET,
        // This token stores its symbol as bytes32, therefore can not be fetched on-chain using
        // our token providers.
        // This workaround adds it to the cache, so we won't try to fetch it on-chain.
        RING: new Token(ChainId.MAINNET, '0x9469D013805bFfB7D3DEBe5E7839237e535ec483', 18, 'RING', 'RING'),
    },
    [ChainId.SEPOLIA]: {
        USDC: USDC_SEPOLIA,
    },
    [ChainId.BIT_DEVNET]: {
        WETH: WRAPPED_NATIVE_CURRENCY[ChainId.BIT_DEVNET],
    },
    [ChainId.BIT_MAINNET]: {
        WETH: WRAPPED_NATIVE_CURRENCY[ChainId.BIT_MAINNET],
        USD: USD_BIT_MAINNET,
        BBTC: BTC_BIT_MAINNET
    },
    // Currently we do not have providers for Moonbeam mainnet or Gnosis testnet
};
/**
 * Provider for getting token metadata that falls back to a different provider
 * in the event of failure.
 *
 * @export
 * @class CachingTokenProviderWithFallback
 */
export class CachingTokenProviderWithFallback {
    constructor(chainId, 
    // Token metadata (e.g. symbol and decimals) don't change so can be cached indefinitely.
    // Constructing a new token object is slow as sdk-core does checksumming.
    tokenCache, primaryTokenProvider, fallbackTokenProvider) {
        this.chainId = chainId;
        this.tokenCache = tokenCache;
        this.primaryTokenProvider = primaryTokenProvider;
        this.fallbackTokenProvider = fallbackTokenProvider;
        this.CACHE_KEY = (chainId, address) => `token-${chainId}-${address}`;
    }
    async getTokens(_addresses) {
        const seedTokens = CACHE_SEED_TOKENS[this.chainId];
        if (seedTokens) {
            for (const token of Object.values(seedTokens)) {
                await this.tokenCache.set(this.CACHE_KEY(this.chainId, token.address.toLowerCase()), token);
            }
        }
        const addressToToken = {};
        const symbolToToken = {};
        const addresses = _(_addresses)
            .map((address) => address.toLowerCase())
            .uniq()
            .value();
        const addressesToFindInPrimary = [];
        const addressesToFindInSecondary = [];
        for (const address of addresses) {
            if (await this.tokenCache.has(this.CACHE_KEY(this.chainId, address))) {
                addressToToken[address.toLowerCase()] = (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
                symbolToToken[addressToToken[address].symbol] =
                    (await this.tokenCache.get(this.CACHE_KEY(this.chainId, address)));
            }
            else {
                addressesToFindInPrimary.push(address);
            }
        }
        log.info({ addressesToFindInPrimary }, `Found ${addresses.length - addressesToFindInPrimary.length} out of ${addresses.length} tokens in local cache. ${addressesToFindInPrimary.length > 0
            ? `Checking primary token provider for ${addressesToFindInPrimary.length} tokens`
            : ``}
      `);
        if (addressesToFindInPrimary.length > 0) {
            const primaryTokenAccessor = await this.primaryTokenProvider.getTokens(addressesToFindInPrimary);
            for (const address of addressesToFindInPrimary) {
                const token = primaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
                else {
                    addressesToFindInSecondary.push(address);
                }
            }
            log.info({ addressesToFindInSecondary }, `Found ${addressesToFindInPrimary.length - addressesToFindInSecondary.length} tokens in primary. ${this.fallbackTokenProvider
                ? `Checking secondary token provider for ${addressesToFindInSecondary.length} tokens`
                : `No fallback token provider specified. About to return.`}`);
        }
        if (this.fallbackTokenProvider && addressesToFindInSecondary.length > 0) {
            const secondaryTokenAccessor = await this.fallbackTokenProvider.getTokens(addressesToFindInSecondary);
            for (const address of addressesToFindInSecondary) {
                const token = secondaryTokenAccessor.getTokenByAddress(address);
                if (token) {
                    addressToToken[address.toLowerCase()] = token;
                    symbolToToken[addressToToken[address].symbol] = token;
                    await this.tokenCache.set(this.CACHE_KEY(this.chainId, address.toLowerCase()), addressToToken[address]);
                }
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGluZy10b2tlbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvY2FjaGluZy10b2tlbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUV2QixPQUFPLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR3ZELE9BQU8sRUFDTCxlQUFlLEVBQ2YsV0FBVyxFQUdYLGVBQWUsRUFDZixZQUFZLEVBQ1osWUFBWSxFQUNaLFlBQVksRUFDWixZQUFZLEdBQ2IsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQixnRUFBZ0U7QUFDaEUsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBRTFCO0lBQ0YsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDakIsSUFBSSxFQUFFLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUU7UUFDL0MsSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsR0FBRyxFQUFFLFdBQVc7UUFDaEIsdUZBQXVGO1FBQ3ZGLHVCQUF1QjtRQUN2Qiw4RUFBOEU7UUFDOUUsSUFBSSxFQUFFLElBQUksS0FBSyxDQUNiLE9BQU8sQ0FBQyxPQUFPLEVBQ2YsNENBQTRDLEVBQzVDLEVBQUUsRUFDRixNQUFNLEVBQ04sTUFBTSxDQUNQO0tBQ0Y7SUFDRCxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNqQixJQUFJLEVBQUUsWUFBWTtLQUNuQjtJQUNELENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQ3BCLElBQUksRUFBRSx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFFO0tBQ25EO0lBQ0QsQ0FB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