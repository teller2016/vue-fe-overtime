<template>
    <div class="sb__option">
        <header class="option__header">{{ headerTitle }}</header>

        <div class="option__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        headerTitle: String,
    },
}
</script>

<style lang="scss" scoped>
.sb {
    &__option {
        width: 100%;
        padding: 0 16px;

        &:not(:first-of-type) {
            border-left: 1px solid black;
        }
        .option {
            &__header {
                font-weight: 700;
                font-size: 24px;
            }
        }
    }
}
</style>