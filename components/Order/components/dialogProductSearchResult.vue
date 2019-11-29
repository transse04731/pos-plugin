<template>
  <g-dialog v-model="dialogProductSearch">
    <g-card style="height: 568px">
      <g-card-title>
        {{formattedQueryResults.length}} {{formattedQueryResults.length > 1 ? 'results' : 'result'}} for product id "{{productIdQuery}}"
        <g-spacer></g-spacer>
        <g-btn @click="dialogProductSearch = false" icon>
          <g-icon>close</g-icon>
        </g-btn>
      </g-card-title>
      <g-simple-table fixed-header height="500px" striped>
        <template>
          <thead>
          <tr class="search-table-row">
            <th class="text-left">Product</th>
            <th class="text-left">Unit</th>
            <th class="text-left">Attribute</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr :key="index" v-for="(product, index) in formattedQueryResults">
            <td>
              <div class="result-item result-item-product" style="display: flex;">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <p>{{index + 1}}</p>
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                  <div style="padding: 20px;">
                    <div><p>{{product.id}}</p></div>
                    <div><p><b>{{product.name}}</b></p></div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="result-item result-item-unit" style="display: flex;">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <g-item-group :items="product.unit" v-model="product.selectedUnit">
                    <template v-slot:item="{item, toggle, active}">
                      <g-badge overlay style="margin: 12px" v-model="active">
                        <template v-slot:badge>
                          <g-icon x-small>done</g-icon>
                        </template>
                        <g-btn @click="toggle(item)" outlined style="margin-left: 5px" :active="active" :class="[active ? activeClass : {}]">
                          {{item}}
                        </g-btn>
                      </g-badge>
                    </template>
                  </g-item-group>
                </div>
              </div>
            </td>
            <td>
              <div class="result-item result-item-attribute" v-if="product.attributes">
                <div class="result-item-attribute-row" v-for="(attributes, key) in product.attributes">
                  <div class="attribute-title">
                    <span>
                      {{key}}
                    </span>
                  </div>
                  <g-item-group :items="attributes"
                                v-model="product.selectedAttributes[key]"
                  >
                    <template v-slot:item="{item, toggle, active}">
                      <g-badge overlay style="margin: 12px" v-model="active">
                        <template v-slot:badge>
                          <g-icon x-small>done</g-icon>
                        </template>
                        <g-btn @click="toggle(item)" outlined style="margin-left: 5px" :active="active" :class="[active ? activeClass : {}]">
                          {{item.value}}
                        </g-btn>
                      </g-badge>
                    </template>
                  </g-item-group>
                </div>
              </div>
            </td>
            <td>
              <div class="result-item result-item-action" style="display: flex; justify-content: center; align-items: center;">
                <g-btn :disabled="!isValidItem(product)"
                       background-color="red"
                       text-color="white"
                       @click.stop="addProductToOrder(product)"
                >
                  <g-icon class="mr-2" svg>icon-back</g-icon>
                  Create new order
                </g-btn>
              </div>
            </td>
          </tr>
          </tbody>
        </template>
      </g-simple-table>
    </g-card>
  </g-dialog>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'dialogProductSearchResult',
    props: {
      value: null
    },
    injectService: ['PosStore:(productIdQuery,productIdQueryResults)'],
    data: () => ({
      activeClass: 'active-attribute',
      queryResults: []
    }),
    computed: {
      dialogProductSearch: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      },
      formattedQueryResults: {
        get() {
          if (this.productIdQueryResults) {
            this.queryResults = this.productIdQueryResults.map(result => {
              let hasAttributes = result.attributes && result.attributes.length;
              const computedAttributes = hasAttributes && _.groupBy(result.attributes, 'key')
              let selectedAttributes;

              if (hasAttributes) {
                selectedAttributes = {}
                for (const key in computedAttributes) {
                  if (computedAttributes.hasOwnProperty(key)) Object.assign(selectedAttributes, {[key]: []})
                }
              }

              return {
                _id: result._id,
                id: result.id,
                name: result.name,
                unit: Array.isArray(result.unit) ? result.unit : [result.unit],
                selectedUnit: null,
                ...hasAttributes && { attributes: computedAttributes },
                ...hasAttributes && { selectedAttributes }
              }
            })
          }
          return this.queryResults
        },
        set(value) {
          this.queryResults = value
        }
      },
    },
    methods: {
      isValidItem({ selectedAttributes, selectedUnit, unit }) {
        if (selectedAttributes) {
          for (const key in selectedAttributes) {
            if (selectedAttributes.hasOwnProperty(key) && !selectedAttributes[key]) return false
          }
        }
        if (unit) return !!selectedUnit;
        return true
      },
      addProductToOrder(product) {
        const _product = _.clone(this.productIdQueryResults.find(i => i._id === product._id))
        _product.unit = product.selectedUnit
        _product.attributes = _.values(product.selectedAttributes)
        this.$getService('PosStore:addProductToOrder')(_product)
      }
    }
  }
</script>

<style scoped>
  .result-item-attribute-row {
    display: flex;
    padding: 5px;
  }

  .active-attribute {
    background-color: #E0E0E0 !important;
  }

  .result-item-attribute {
    padding-bottom: 12px;
  }

  .attribute-title {
    padding-top: 12px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .g-card-title {
    font-size: 16px !important;
    line-height: 20px !important;
  }

  ::v-deep .g-badge-wrapper {
    margin: 12px 12px 0 0 !important;
  }

  .g-item-group {
    display: inline-flex;
  }

  .g-card {
    overflow-y: hidden !important;
  }

  th {
    background-color: #E0E0E0;
    font-size: 14px !important;
    color: #000000 !important;
    font-weight: normal;
    line-height: 18px;
  }

  ::v-deep .g-btn__disabled {

  }
</style>
