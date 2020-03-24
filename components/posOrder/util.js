export function createEmptyProductLayout() {
  return {
    type: 'Article',
    text: '',
    color: '#EAEAEA',
    product: {
      type: null,
      id: null,
      name: null,
      groupPrinter: null,
      groupPrinter2: null,
      isNoPrint: null,
      isItemNote: null,
      tax: null,
      tax2: null,
      category: null,
      isDivArticle: null
    }
  }
}
