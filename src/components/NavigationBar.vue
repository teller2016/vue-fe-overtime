<template>
  <nav class="sb__nav">
    <h1 class="nav__title">일지 정리 툴</h1>

    <ul class="nav__list">
      <li class="nav__item">
        <router-link class="nav__link" active-class="active" :to="{ name: 'WeekAll' }"> 주간전체보고 작성 </router-link>
      </li>
      <li class="nav__item">
        <router-link class="nav__link" active-class="active" :to="{ name: 'PersonalWeek' }">
          개인주간보고 작성
        </router-link>
      </li>
      <li class="nav__item">
        <router-link class="nav__link" active-class="active" :to="{ name: 'OT' }"> OT 작성 </router-link>
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
      max-width: 1920px;
      margin: 0 auto 24px;
      padding: 12px 20px;
      background: $dark-surface;
      border: 1px solid $dark-border;
      border-radius: 12px;

      .nav {
        &__title {
          display: inline-block;
          font-weight: 700;
          font-size: 24px;
          color: $accent-primary-light;
        }

        &__list {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 30px;
        }

        &__link {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 8px;
          color: $dark-text-muted;
          font-weight: 400;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            color: $dark-text;
            background: rgba(255, 255, 255, 0.04);
          }

          &.active {
            color: $accent-primary;
            font-weight: 600;
            background: $accent-primary-dim;
          }
        }
      }
    }
  }
</style>
