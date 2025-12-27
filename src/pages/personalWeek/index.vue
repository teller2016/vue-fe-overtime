<template>
  <div>개인 주간보고 작성</div>
  {{ a }}
</template>

<script setup>
  import personalWeekComposable from '@/composables/pages/personalWeek/index';

  const { a } = personalWeekComposable();
</script>

<style lang="scss" scoped></style>
