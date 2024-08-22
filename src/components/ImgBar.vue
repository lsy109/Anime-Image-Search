<template>
  <div class="ImgBody">
    <input v-model="symbol" placeholder="Enter stock symbol" />
    <button @click="fetchStockQuote">Get Quote</button>
    <div v-if="quote">
      <p><strong>Symbol:</strong> {{ quote.symbol }}</p>
      <p><strong>Current Price:</strong> {{ quote.c }}</p>
      <p><strong>High Price:</strong> {{ quote.h }}</p>
      <p><strong>Low Price:</strong> {{ quote.l }}</p>
      <p><strong>Open Price:</strong> {{ quote.o }}</p>
      <p><strong>Previous Close Price:</strong> {{ quote.pc }}</p>
    </div>

    <div v-if="candles && candles.t.length">
      <h3>Candlw Data (Last 5 Years)</h3>
      <ul>
        <li v-for="(candle, index) in candles.t" :key="index">
          <strong>Date:</strong> {{ formatDate(candles.t[index]) }},
          <strong>Open:</strong> {{ candles.o[index] }}, <strong>High:</strong
          >{{ candles.h[index] }}, <strong>Low:</strong> {{ candles.l[index] }},
          <strong>Close:</strong> {{ candles.c[index] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImgBody",
  data() {
    return {
      symbol: "",
      quote: null,
      candles: null,
      error: null,
    };
  },
  methods: {
    async fetchStockQuote() {
      const apiKey = "cqtd36pr01qjppeeed5gcqtd36pr01qjppeeed60";
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${this.symbol}&token=${apiKey}`;
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - 5 * 365 * 24 * 60 * 60;
      const candlesUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${this.symbol}&resolution=D&from=${startTime}&to=${endTime}&token=${apiKey}`;

      try {
        const [quoteResponse, candlesResponse] = await Promise.all([
          axios.get(quoteUrl),
          axios.get(candlesUrl),
        ]);

        this.quote = quoteResponse.data;
        console.log(this.quote);
        if (candlesResponse.data.s === "ok") {
          this.candles = candlesResponse.data;
          this.error = null;
        } else {
          throw new Error("No candle data available");
        }
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        this.error =
          "Failed to fetch data. Please check the symbol and try again.";
        this.quote = null;
        this.candles = null;
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toISOString().split("T")[0];
    },
  },
};
</script>
