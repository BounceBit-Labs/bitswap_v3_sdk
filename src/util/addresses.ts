import { CHAIN_TO_ADDRESSES_MAP, ChainId, SWAP_ROUTER_02_ADDRESSES as SWAP_ROUTER_02_ADDRESSES_HELPER ,Token} from '@uniswap/sdk-core';
import { FACTORY_ADDRESS } from '@uniswap/v3-sdk';

import { NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains';


export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(FACTORY_ADDRESS[1]),
  [ChainId.BIT_DEVNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_DEVNET].v3CoreFactoryAddress,
  [ChainId.BIT_MAINNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_MAINNET].v3CoreFactoryAddress,
  // TODO: Gnosis + Moonbeam contracts to be deployed
};

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x61fFE014bA17989E743c5F6cB21bF9697530B21e'),
  [ChainId.BIT_DEVNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_DEVNET].quoterAddress,
  [ChainId.BIT_MAINNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_MAINNET].quoterAddress
  // TODO: Gnosis + Moonbeam contracts to be deployed
};

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]:
    CHAIN_TO_ADDRESSES_MAP[ChainId.MAINNET].v1MixedRouteQuoterAddress,
  [ChainId.BIT_MAINNET]: '0x873051Be4c93C982f00023181233CAA6ed55a4DA',
};

export const UNISWAP_MULTICALL_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984'),
  [ChainId.BIT_DEVNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_DEVNET].multicallAddress,
  [ChainId.BIT_MAINNET]: CHAIN_TO_ADDRESSES_MAP[ChainId.BIT_MAINNET].multicallAddress,
};

export const SWAP_ROUTER_02_ADDRESSES = (chainId: number): string => {
  return SWAP_ROUTER_02_ADDRESSES_HELPER(chainId) ?? '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
};

export const OVM_GASPRICE_ADDRESS =
  '0x420000000000000000000000000000000000000F';
export const ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C';

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS =
  CHAIN_TO_ADDRESSES_MAP[ChainId.MAINNET].nonfungiblePositionManagerAddress;
export const V3_MIGRATOR_ADDRESS =
  CHAIN_TO_ADDRESSES_MAP[ChainId.MAINNET].v3MigratorAddress;
export const MULTICALL2_ADDRESS = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696';

export type AddressMap = { [chainId: number]: string | undefined };

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: ChainId[] = []
): { [chainId: number]: T } {
  return NETWORKS_WITH_SAME_UNISWAP_ADDRESSES.concat(
    additionalNetworks
  ).reduce<{
    [chainId: number]: T;
  }>((memo, chainId) => {
    memo[chainId] = address;
    return memo;
  }, {});
}

export const WETH9: {
  [chainId in ChainId]: Token;
} = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GOERLI]: new Token(
    ChainId.GOERLI,
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.SEPOLIA]: new Token(
    ChainId.SEPOLIA,
    '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.BIT_DEVNET]: new Token(6000, '0x2Fe2C332E5F72F0AC76e82BaDD8261B8FbcFDFe3', 18, 'WBB', 'Wrapped BounceBit'),
  [ChainId.BIT_MAINNET]: new Token(6001, '0xF4c20e5004C6FDCDdA920bDD491ba8C98a9c5863', 18, 'WBB', 'Wrapped BounceBit')
};
