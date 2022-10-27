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
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((e) => e.close) as number[],
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
            stroke: {
              curve: "smooth",
            },
            grid: { show: false },
            yaxis: { show: false },
            xaxis: {
              type: "datetime",
              categories: data?.map((e) =>
                new Date(Number(e.time_close) * 1000).toISOString()
              ),
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
