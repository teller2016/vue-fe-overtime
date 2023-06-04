<template>
  <div class="sb__container">
    <!-- 옵션 영역 -->
    <div class="container__box">
      <div class="sb__options">
        <div class="sb__option">
          <header class="option__header">
            비즈박스 로그인
          </header>

          <div class="option__content">
            <!-- 아이디 -->
            <div class="sb__input">
              <span class="input__name">아이디</span>
              <label class="input__label">
                <input
                  class="input__value"
                  type="text"
                  v-model="id"
                />
              </label>
            </div>

            <!-- 아이디 -->
            <div class="sb__input">
              <span class="input__name">비밀번호</span>
              <label class="input__label">
                <input
                  class="input__value"
                  type="password"
                  v-model="password"
                />
              </label>
            </div>

          </div>
        </div>

        <div class="sb__option">
          <header class="option__header">일정</header>

          <div class="option__content">
            <textarea
              class="sb__textarea"
              v-model="daySchedule"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="container__box sb__macro">
      <div class="macro__start">
        <ButtonElement
          class="macro__btn"
          type="button"
          size="xlg"
          line="black"
          @on-click="startMacro"
        >매크로 실행</ButtonElement>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import ButtonElement from "@/components/elements/ButtonElement.vue";

export default {
  components: { ButtonElement },
  setup() {
    const id = ref("");
    const password = ref("");
    const daySchedule = ref(`12 [스마일게이트] 디자인 검수 이슈처리

12.5 [FE] 메타커머스 rem 적용 가이드

14 [스마일게이트] 디자인 검수 이슈처리

15 [FE] 메타커머스 rem 적용 가이드

18.5 [스마일게이트] 통합 QA, 디자인 검수 이슈처리`);

    const startMacro = () => {};

    return {
      id,
      password,
      daySchedule,
      startMacro,
    };
  },
};
</script>

<style lang="scss" scoped>
.sb {
  // TODO: Input Component로 분리 필요
  &__input {
    display: flex;
    align-items: center;
    gap: 16px;

    &:not(:first-of-type) {
      margin-top: 8px;
    }
    .input {
      &__name {
        display: inline-block;
        width: 100px;
        text-align: left;
      }

      &__label {
      }

      &__value {
      }
    }
  }

  &__textarea {
    width: 100%;
    min-height: 400px;
  }

  &__macro {
    margin-top: 40px;
    padding: 20px;

    .macro {
      &__start {
      }

      &__btn {
        width: 200px;
      }
    }
  }
}
</style>
