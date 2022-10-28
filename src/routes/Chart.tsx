import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

interface CharProps {
  coinId: string;
}

interface IHistory {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: CharProps) {
  const { isLoading, data } = useQuery<IHistory[]>(
    [`chart`, coinId],
    () => fetchCoinHistory(coinId),
    { refetchInterval: 5000 }
  );
  return (
    <div>
      {isLoading ? (
        "Loding..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              name: "Price",
              data:
                data?.map((e) => ({
                  x: new Date(Number(e.time_close) * 1000).toISOString(),
                  y: [e.open, e.high, e.low, e.close],
                })) ?? [],
            },
          ]}
          options={{
            colors: ["#FFE12E"],
            theme: { mode: "dark" },
            chart: {
              background: "transparent",
              height: 500,
              width: 500,
              toolbar: { show: false },
            },
            tooltip: { y: { formatter: (e) => `$ ${e.toFixed(2)}` } },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              type: "datetime",
              axisTicks: { show: false },
              labels: { show: false },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
