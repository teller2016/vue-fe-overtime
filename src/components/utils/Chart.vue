<template>
  <template v-if="type == 'bar'">
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  <template v-else-if="type == 'round'">
    <Doughnut :data="chartData" :options="chartOptions" />
  </template>
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
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);
export default {
  components: {
    Bar,
    Doughnut,
  },
  props: {
    chartData: Object,
    chartOptions: Object,
    type: String,
  },
  setup() {
    return {};
  },
};
</script>

<style></style>
