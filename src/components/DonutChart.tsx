import * as React from "react";
import { useQuery } from "react-query";
import { Cell, Pie, PieChart, Tooltip } from "recharts";

import { microgen } from "@/lib/microgen";

const COLORS = ["#A50021", "#f3f4f6"];

const DonutChart = () => {
  const { data: dataAssets } = useQuery(
    ["get-asset-status"],
    async () => {
      const { data } = await microgen
        .service("Assets")
        .find({ lookup: { "*": "*" } });
      return data;
    },
    { refetchOnWindowFocus: false },
  );

  // Calculate chart data directly from dataAssets
  const chartData = React.useMemo(() => {
    if (!dataAssets) return [];

    const readyToDeploy = dataAssets.filter(
      (asset) => asset.status === "Ready To Deploy",
    ).length;
    const total = dataAssets.length;

    return [
      { name: "Ready to Deploy", value: readyToDeploy },
      { name: "Other", value: total - readyToDeploy },
    ];
  }, [dataAssets]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold">Asset by Status</h3>
      <PieChart width={200} height={200}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <p className="mt-2 text-center">
        <span className="mr-2 inline-block h-4 w-12 bg-merah-primary"></span>{" "}
        Ready to Deploy
      </p>
    </div>
  );
};

export default DonutChart;
