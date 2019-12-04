<template>
  <div class="wrapper">
    <span>Rows per page:</span>
    <g-select :items="computedRowsPerPageItems"
              v-model="selectLimit"
              @input="changeLimitRow($event)"
    />
    <div style="margin: 0 16px">
      Page:
    </div>
    <div align-start row class="combo-page" style="margin: 0 16px; width: 64px">
      <g-combobox
          v-model="comboPage"
          :items="listPageNumber"
          @input="gotoPage($event)"
          style="font-size: 13px;"
      ></g-combobox>
    </div>
    <div style="margin: 0 16px">Total: {{totalDocument}}</div>
    <g-btn icon flat :disabled="disablePre" @click="gotoFirstPage">
      <g-icon>first_page</g-icon>
    </g-btn>
    <g-btn icon flat :disabled="disablePre" @click="prevPage">
      <g-icon>chevron_left</g-icon>
    </g-btn>
    <g-btn icon flat :disabled="disableNext" @click="nextPage">
      <g-icon>chevron_right</g-icon>
    </g-btn>
    <g-btn icon flat :disabled="disableNext" @click="gotoLastPage">
      <g-icon>last_page</g-icon>
    </g-btn>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'PosTablePagination',
    props: {
      limit: Number,
      totalDocument: Number,
      currentPage: Number
    },
    data: () => ({
      computedRowsPerPageItems: [10, 15, 20, 25, 50]
    }),
    methods: {
      nextPage() {
        let page = this.currentPage + 1;
        this.$emit('update:currentPage', page);
        this.$emit('execQueryByPage');
      },
      prevPage() {
        let page = this.currentPage - 1;
        this.$emit('update:currentPage', page);
        this.$emit('execQueryByPage');
      },
      changeLimitRow(number) {
        this.$emit('update:limit', number);
        this.$nextTick(() => {
          if (this.currentPage > this.totalPage) {
            this.$emit('update:currentPage', this.totalPage);
          }
          this.$emit('execQueryByPage');
        });
      },
      gotoPage(v) {
        let value = parseInt(v);
        if (!isNaN(value) && value <= this.totalPage) {
          this.$emit('execQueryByPage');
        }
      },
      gotoFirstPage() {
        this.$emit('update:currentPage', 1);
        this.$emit('execQueryByPage');
      },
      gotoLastPage() {
        this.$emit('update:currentPage', this.totalPage);
        this.$emit('execQueryByPage');
      }
    },
    computed: {
      disablePre() {
        return this.currentPage === 1;
      },
      disableNext() {
        return (this.currentPage === this.totalPage) || (this.totalDocument === 0);
      },
      totalPage() {
        return Math.ceil(this.totalDocument / this.limit);
      },
      listPageNumber() {
        let i = 0;
        let list = [];
        while (i < (this.totalPage > 50 ? 50 : this.totalPage)) {
          i++;
          list.push(i);
        }
        return list;
      },
      comboPage: {
        get() {
          return this.currentPage;
        },
        set(v) {
          let value = parseInt(v);
          if (!isNaN(value) && value <= this.totalPage) {
            this.$emit('update:currentPage', value);
          }
        }
      },
      selectLimit: {
        get() {
          return this.limit;
        },
        set(v) {
          let value = parseInt(v);
          if (!isNaN(value)) {
            this.$emit('update:limit', value);
          }
        }
      },
    }
  };
</script>

<style scoped lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .g-select ::v-deep .g-tf-wrapper {
      margin: 16px;
      width: 64px;
    }
  }
</style>
