<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { ref } from "@vue/reactivity";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export default {
  components: {
    Bar,
  },
  setup() {
    const chartData = ref({
      labels: ["월", "화", "수", "목", "금"],
      datasets: [
        {
          label: "스마일게이트",
          data: [5, 6, 7],
          backgroundColor: "#f87979",
          stack: "T",
        },
        {
          label: "푸드케어",
          data: [1, 2, 3],
          stack: "T",
        },
        {
          label: "스마일게이트",
          data: [1, 0, 0],
          stack: "OT",
        },
      ],
    });

    const chartOptions = ref({
      responsive: true,
    });

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>

<style></style>
