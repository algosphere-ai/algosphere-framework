const marketCapQuery = (term, count) => {
	return `
    query MyQuery {
    Solana {
      TokenSupplyUpdates(
        where: {TokenSupplyUpdate: {Currency: {MintAddress: {includes: "${term}"}}}}
        orderBy: {descending: Block_Time, descendingByField: "TokenSupplyUpdate_Marketcap"}
        limitBy: {by: TokenSupplyUpdate_Currency_MintAddress, count: 1}
        limit: {count: ${count}}
      ) {
        TokenSupplyUpdate {
          Marketcap: PostBalanceInUSD
          Currency {
            Symbol
            MintAddress
          }
        }
      }
    }
  }`;
};

const topHoldersQuery = (mintAddress) => {
	return `
    query MyQuery {
    Solana(dataset: realtime) {
      BalanceUpdates(
        limit: { count: 10 }
        orderBy: { descendingByField: "BalanceUpdate_Holding_maximum" }
        where: {
          BalanceUpdate: {
            Currency: {
              MintAddress: { is: "${mintAddress}" }
            }
          }
          Transaction: { Result: { Success: true } }
        }
      ) {
        BalanceUpdate {
          Account {
            Address
          }
          Holding: PostBalance(maximum: Block_Slot)
        }
      }
    }
  }`;
};

const firstTopBuyersQuery = (mintAddress, count) => {
	return `
    query MyQuery {
    Solana {
      DEXTrades(
        where: {
          Trade: {
            Buy: {
              Currency: {
                MintAddress: { is: "${mintAddress}" }
              }
            }
          }
        }
        limit: { count: ${count} }
        orderBy: { ascending: Block_Time }
      ) {
        Trade {
          Buy {
            Amount
            Account {
              Token {
                Owner
              }
            }
          }
        }
      }
    }
  }`;
};

const trendingTokensQuery = () => {
	return `
    query MyQuery {
  Solana {
    DEXTradeByTokens(
      where: {Transaction: {Result: {Success: true}}, Trade: {Side: {Currency: {MintAddress: {is: "So11111111111111111111111111111111111111112"}}}}, Block: {Time: {since: "2024-08-15T04:19:00Z"}}}
      orderBy: {}
      limit: {count: 5}
    ) {
      Trade {
        Currency {
          Name
          MintAddress
          Symbol
        }
        start: PriceInUSD
        min5: PriceInUSD(
          minimum: Block_Time
          if: {Block: {Time: {after: "2024-08-15T05:14:00Z"}}}
        )
        end: PriceInUSD(maximum: Block_Time)
        Side {
          Currency {
            Symbol
            Name
            MintAddress
          }
        }
      }
    }
  }
}`;
};

export { marketCapQuery, topHoldersQuery, firstTopBuyersQuery, trendingTokensQuery };