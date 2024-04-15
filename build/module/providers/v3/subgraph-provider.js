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
        console.log(`Skip V3 query`);
        throw new Error(`Skip V3 query`);
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