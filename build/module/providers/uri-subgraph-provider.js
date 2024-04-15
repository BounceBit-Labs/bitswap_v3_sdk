/**
 * Gets subgraph pools from a URI. The URI shoudl contain a JSON
 * stringified array of V2SubgraphPool objects or V3SubgraphPool
 * objects.
 *
 * @export
 * @class URISubgraphProvider
 * @template TSubgraphPool
 */
export class URISubgraphProvider {
    constructor(chainId, uri, timeout = 6000, retries = 2) {
        this.chainId = chainId;
        this.uri = uri;
        this.timeout = timeout;
        this.retries = retries;
    }
    async getPools() {
        console.log('Skip query URISubgraphProvider');
        // log.info(
        //   { uri: this.uri },
        //   `About to get subgraph pools from URI ${this.uri}`
        // );
        // let allPools: TSubgraphPool[] = [];
        // await retry(
        //   async () => {
        //     const timeout = new Timeout();
        //     const timerPromise = timeout.set(this.timeout).then(() => {
        //       throw new Error(
        //         `Timed out getting pools from subgraph: ${this.timeout}`
        //       );
        //     });
        //     let response;
        //     /* eslint-disable no-useless-catch */
        //     try {
        //       response = await Promise.race([axios.get(this.uri), timerPromise]);
        //     } catch (err) {
        //       throw err;
        //     } finally {
        //       timeout.clear();
        //     }
        //     /* eslint-enable no-useless-catch */
        //     const { data: poolsBuffer, status } = response;
        //     if (status != 200) {
        //       log.error({ response }, `Unabled to get pools from ${this.uri}.`);
        //       throw new Error(`Unable to get pools from ${this.uri}`);
        //     }
        //     const pools = poolsBuffer as TSubgraphPool[];
        //     log.info(
        //       { uri: this.uri, chain: this.chainId },
        //       `Got subgraph pools from uri. Num: ${pools.length}`
        //     );
        //     allPools = pools;
        //   },
        //   {
        //     retries: this.retries,
        //     onRetry: (err, retry) => {
        //       log.info(
        //         { err },
        //         `Failed to get pools from uri ${this.uri}. Retry attempt: ${retry}`
        //       );
        //     },
        //   }
        // );
        // return allPools;
        throw Error('Skip query URISubgraphProvider');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJpLXN1YmdyYXBoLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Byb3ZpZGVycy91cmktc3ViZ3JhcGgtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBWUE7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBRzlCLFlBQ1UsT0FBZ0IsRUFDaEIsR0FBVyxFQUNYLFVBQVUsSUFBSSxFQUNkLFVBQVUsQ0FBQztRQUhYLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUNYLFlBQU8sR0FBUCxPQUFPLENBQU87UUFDZCxZQUFPLEdBQVAsT0FBTyxDQUFJO0lBQ2xCLENBQUM7SUFFRyxLQUFLLENBQUMsUUFBUTtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDN0MsWUFBWTtRQUNaLHVCQUF1QjtRQUN2Qix1REFBdUQ7UUFDdkQsS0FBSztRQUVMLHNDQUFzQztRQUV0QyxlQUFlO1FBQ2Ysa0JBQWtCO1FBQ2xCLHFDQUFxQztRQUNyQyxrRUFBa0U7UUFDbEUseUJBQXlCO1FBQ3pCLG1FQUFtRTtRQUNuRSxXQUFXO1FBQ1gsVUFBVTtRQUVWLG9CQUFvQjtRQUVwQiw0Q0FBNEM7UUFDNUMsWUFBWTtRQUNaLDRFQUE0RTtRQUM1RSxzQkFBc0I7UUFDdEIsbUJBQW1CO1FBQ25CLGtCQUFrQjtRQUNsQix5QkFBeUI7UUFDekIsUUFBUTtRQUNSLDJDQUEyQztRQUUzQyxzREFBc0Q7UUFFdEQsMkJBQTJCO1FBQzNCLDJFQUEyRTtRQUUzRSxpRUFBaUU7UUFDakUsUUFBUTtRQUVSLG9EQUFvRDtRQUVwRCxnQkFBZ0I7UUFDaEIsZ0RBQWdEO1FBQ2hELDREQUE0RDtRQUM1RCxTQUFTO1FBRVQsd0JBQXdCO1FBQ3hCLE9BQU87UUFDUCxNQUFNO1FBQ04sNkJBQTZCO1FBQzdCLGlDQUFpQztRQUNqQyxrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLDhFQUE4RTtRQUM5RSxXQUFXO1FBQ1gsU0FBUztRQUNULE1BQU07UUFDTixLQUFLO1FBRUwsbUJBQW1CO1FBQ25CLE1BQU0sS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDL0MsQ0FBQztDQUNGIn0=