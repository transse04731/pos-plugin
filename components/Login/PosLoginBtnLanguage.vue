<template>
  <div>
    <g-menu v-model="menu" close-on-content-click top content-class="menu-language">
      <template v-slot:activator="{on}">
        <g-btn-bs icon-after="arrow_drop_down" text-color="#3B3B3B" @click="on.click">
          {{language}}
        </g-btn-bs>
      </template>
      <div class="menu">
        <g-btn-bs v-for="(lang, i) in languages" :key="i"
                  :icon="lang.icon" text-color="#201F2B"
                  class="my-2"
                  @click="chooseLanguage(lang)">
          {{lang.title}}
        </g-btn-bs>
      </div>
    </g-menu>
  </div>
</template>

<script>
  export default {
    name: "PosLoginBtnLanguage",
    data() {
      return {
        menu: false,
        language: '',
        languages: [
          { icon: 'icon-germany', title: 'Germany'},
          { icon: 'icon-english', title: 'English'},
        ]
      }
    },
    created() {
      this.chooseLanguage(this.languages[0])
    },
    methods: {
      chooseLanguage(language) {
        this.language = language.title
      }
    }
  }
</script>

<style scoped lang="scss">
  .g-btn-bs {
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
    margin: 0;
    justify-content: flex-start;
  }
</style>

<style lang="scss">
  .menu-language {
    background: white;
    border-radius: 2px;
    padding: 0 6px;
  }
</style>
