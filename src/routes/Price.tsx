import { useQuery } from "@tanstack/react-query";
import { fetchCoinPrice } from "../api";
import ApexChart from "react-apexcharts";

interface PriceProps {
  coinId: string;
}

// priceData interface
interface USD {
  priceData: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_15m: number;
  percent_change_30m: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_1y: number;
  ath_price?: any;
  ath_date?: any;
  percent_from_price_ath?: any;
}
interface Quotes {
  USD: USD;
}
interface IPrice {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: Date;
  last_updated: Date;
  quotes: Quotes;
}
// priceData interface

function Price({ coinId }: PriceProps) {
  const { isLoading, data } = useQuery<IPrice>(
    [`Price`, coinId],
    () => fetchCoinPrice(coinId),
    { refetchInterval: 5000 }
  );

  return (
    <div>
      {isLoading ? (
        "Loding..."
      ) : (
        <ApexChart
          type="bar"
          series={[
            {
              name: "Price",
              data: [
                Number(data?.quotes.USD.percent_change_1y),
                Number(data?.quotes.USD.percent_change_30d),
                Number(data?.quotes.USD.percent_change_7d),
                Number(data?.quotes.USD.percent_change_24h),
                Number(data?.quotes.USD.percent_change_12h),
              ],
            },
          ]}
          options={{
            colors: ["#9c88ff"],
            theme: { mode: "dark" },
            chart: {
              background: "transparent",
              height: 500,
              width: 500,
              toolbar: { show: false },
            },
            tooltip: { y: { formatter: (e) => `$ ${e.toFixed(2)}` } },
            stroke: {
              curve: "smooth",
            },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              categories: ["1y", "30d", "7d", "24h", "12h"],
              axisTicks: { show: false },
            },
            title: {
              text: "Percent Change",
              floating: true,
              align: "center",
              style: {
                color: "#9c88ff",
                fontSize: "20",
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default Price;
