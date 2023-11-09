import Vue from 'vue'
// Get the swap route using Squid API

const squidAxelar = {
  async getChains (context) {
    const result = await context.$axios.get('https://v2.api.squidrouter.com/v2/chains', {
      headers: {
        'x-integrator-id': process.env.squidAxelarApi,
      },
    });
    return result.data;
  },

  async getTokens (context) {
    const result = await context.$axios.get('https://v2.api.squidrouter.com/v2/tokens', {
      headers: {
        'x-integrator-id': process.env.squidAxelarApi,
      },
    });
    return result.data;
  },

  /*
  params
  {
    fromChain: 43114, // Avalanche
    toChain: 137, // Polygon
    fromToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    toToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    fromAmount: "100000000000000000", // 0.1 AVAX
    fromAddress: '0x1EAbF384277c5647f2cdB00b586317510c737f81',
    toAddress: '0x1EAbF384277c5647f2cdB00b586317510c737f81',
    slippageConfig: {
      autoMode: 1
    }
  }
  */
  async getRoute (context, params) {
    try {
      const result = await context.$axios.post(
        "https://v2.api.squidrouter.com/v2/route",
        params,
        {
          headers: {
            "x-integrator-id": process.env.squidAxelarApi,
            "Content-Type": "application/json",
          },
        }
      );
      const requestId = result.headers["x-request-id"];
      return { data: result.data, requestId };
    } catch (error) {
      // Log the error response if it's available.
      if (error.response) {
        console.error("API error:", error.response.data);
      }
      console.error("Error with parameters:", params);
      throw error;
    }
  },

}
Vue.prototype.$squidAxelar = squidAxelar
