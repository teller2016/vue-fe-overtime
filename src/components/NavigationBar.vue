<template>
  <nav class="sb__nav">
    <h1 class="nav__title">일지 정리 툴</h1>

    <ul class="nav__list">
      <li class="nav__item">
        <router-link class="nav__link" :to="{ name: 'Week' }">
          주간보고 작성
        </router-link>
      </li>
      <li class="nav__item">
        <router-link class="nav__link" :to="{ name: 'OT' }">
          OT 작성
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.sb {
  &__nav {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    padding: 8px;
    background: $pGreen;
    border-radius: 16px;

    .nav {
      &__title {
        display: inline-block;
        font-weight: 700;
        font-size: 30px;
      }

      &__list {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 30px;
      }

      &__item {
      }

      &__link {
        font-size: 16px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
