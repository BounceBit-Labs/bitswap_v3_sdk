// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ChainId } from '@uniswap/sdk-core';
import { GraphQLClient } from 'graphql-request';
export const printV3SubgraphPool = (s) => `${s.token0.id}/${s.token1.id}/${s.feeTier}`;
export const printV2SubgraphPool = (s) => `${s.token0.id}/${s.token1.id}`;
const SUBGRAPH_URL_BY_CHAIN = {
    [ChainId.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli',
    [ChainId.BIT_DEVNET]: 'http://18.139.219.13:8000/subgraphs/name/ianlapham/uniswap-v3'
};
const PAGE_SIZE = 1000; // 1k is max possible query size from subgraph.
export class V3SubgraphProvider {
    constructor(chainId, retries = 2, timeout = 30000, rollback = true) {
        this.chainId = chainId;
        this.retries = retries;
        this.timeout = timeout;
        this.rollback = rollback;
        const subgraphUrl = SUBGRAPH_URL_BY_CHAIN[this.chainId];
        if (!subgraphUrl) {
            throw new Error(`No subgraph url for chain id: ${this.chainId}`);
        }
        this.client = new GraphQLClient(subgraphUrl);
    }
    async getPools(_tokenIn, _tokenOut, providerConfig) {
        throw new Error(`Skip V3`);
        // let blockNumber = providerConfig?.blockNumber
        //   ? await providerConfig.blockNumber
        //   : undefined;
        // const query = gql`
        //   query getPools($pageSize: Int!, $id: String) {
        //     pools(
        //       first: $pageSize
        //       ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
        //       where: { id_gt: $id }
        //     ) {
        //       id
        //       token0 {
        //         symbol
        //         id
        //       }
        //       token1 {
        //         symbol
        //         id
        //       }
        //       feeTier
        //       liquidity
        //       totalValueLockedUSD
        //       totalValueLockedETH
        //     }
        //   }
        // `;
        // let pools: RawV3SubgraphPool[] = [];
        // log.info(
        //   `Getting V3 pools from the subgraph with page size ${PAGE_SIZE}${
        //     providerConfig?.blockNumber
        //       ? ` as of block ${providerConfig?.blockNumber}`
        //       : ''
        //   }.`
        // );
        // await retry(
        //   async () => {
        //     const timeout = new Timeout();
        //     const getPools = async (): Promise<RawV3SubgraphPool[]> => {
        //       let lastId = '';
        //       let pools: RawV3SubgraphPool[] = [];
        //       let poolsPage: RawV3SubgraphPool[] = [];
        //       do {
        //         const poolsResult = await this.client.request<{
        //           pools: RawV3SubgraphPool[];
        //         }>(query, {
        //           pageSize: PAGE_SIZE,
        //           id: lastId,
        //         });
        //         poolsPage = poolsResult.pools;
        //         pools = pools.concat(poolsPage);
        //         lastId = pools[pools.length - 1]!.id;
        //       } while (poolsPage.length > 0);
        //       return pools;
        //     };
        //     /* eslint-disable no-useless-catch */
        //     try {
        //       const getPoolsPromise = getPools();
        //       const timerPromise = timeout.set(this.timeout).then(() => {
        //         throw new Error(
        //           `Timed out getting pools from subgraph: ${this.timeout}`
        //         );
        //       });
        //       pools = await Promise.race([getPoolsPromise, timerPromise]);
        //       return;
        //     } catch (err) {
        //       throw err;
        //     } finally {
        //       timeout.clear();
        //     }
        //     /* eslint-enable no-useless-catch */
        //   },
        //   {
        //     retries: this.retries,
        //     onRetry: (err, retry) => {
        //       if (
        //         this.rollback &&
        //         blockNumber &&
        //         _.includes(err.message, 'indexed up to')
        //       ) {
        //         blockNumber = blockNumber - 10;
        //         log.info(
        //           `Detected subgraph indexing error. Rolled back block number to: ${blockNumber}`
        //         );
        //       }
        //       pools = [];
        //       log.info(
        //         { err },
        //         `Failed to get pools from subgraph. Retry attempt: ${retry}`
        //       );
        //     },
        //   }
        // );
        // const poolsSanitized = pools
        //   .filter(
        //     (pool) =>
        //       parseInt(pool.liquidity) > 0 ||
        //       parseFloat(pool.totalValueLockedETH) > 0.01
        //   )
        //   .map((pool) => {
        //     const { totalValueLockedETH, totalValueLockedUSD, ...rest } = pool;
        //     return {
        //       ...rest,
        //       id: pool.id.toLowerCase(),
        //       token0: {
        //         id: pool.token0.id.toLowerCase(),
        //       },
        //       token1: {
        //         id: pool.token1.id.toLowerCase(),
        //       },
        //       tvlETH: parseFloat(totalValueLockedETH),
        //       tvlUSD: parseFloat(totalValueLockedUSD),
        //     };
        //   });
        // log.info(
        //   `Got ${pools.length} V3 pools from the subgraph. ${poolsSanitized.length} after filtering`
        // );
        // return poolsSanitized;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViZ3JhcGgtcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3YzL3N1YmdyYXBoLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDZEQUE2RDtBQUM3RCxjQUFjO0FBRWQsT0FBTyxFQUFFLE9BQU8sRUFBUyxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE9BQU8sRUFBTyxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQXFDckQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FDdkQsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFL0MsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FDdkQsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRWxDLE1BQU0scUJBQXFCLEdBQXNDO0lBQy9ELENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUNmLDREQUE0RDtJQUM5RCxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDZCxvRUFBb0U7SUFDdEUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUMsK0RBQStEO0NBQ3JGLENBQUM7QUFFRixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQywrQ0FBK0M7QUFnQnZFLE1BQU0sT0FBTyxrQkFBa0I7SUFHN0IsWUFDVSxPQUFnQixFQUNoQixVQUFVLENBQUMsRUFDWCxVQUFVLEtBQUssRUFDZixXQUFXLElBQUk7UUFIZixZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFDWCxZQUFPLEdBQVAsT0FBTyxD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