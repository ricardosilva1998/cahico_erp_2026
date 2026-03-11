<script setup lang="ts">
import Menu from './menu/tabs/Tabs.vue'
import Logo from './logo/Logo.vue'
import AccountSection from './account/AccountSection.vue'

interface TabItem {
  name: string
}

const props = defineProps<{
  tabs: TabItem[]
}>()
</script>

<template>
  <div class="header">
    <div class="col-logo">
      <div class="header-bubble">
        <Logo />
      </div>
    </div>
    <div class="col-menu">
      <div class="header-bubble">
        <Menu :tabs="props.tabs" />
      </div>
    </div>
    <div class="col-account">
      <div class="header-bubble">
        <AccountSection />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 65px;
  padding: 8px 10px;

  .col-logo {
    width: 12%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .col-menu {
    width: 66%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .col-account {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header-bubble {
    width: auto;
    height: 100%;
    background-color: $color-sand;
    border: 1px solid $color-border;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
