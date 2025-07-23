export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-html/astro', 'stylelint-config-recess-order'],
  rules: {
    'selector-class-pattern': '^[a-z-][a-zA-Z0-9_-]+$',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        // 次の擬似クラスの使用を許可
        // :global()
        ignorePseudoClasses: ['global'],
      },
    ],
    'custom-property-empty-line-before': null,
    'scss/dollar-variable-pattern': /[a-z][a-zA-Z]+/,
  },
};
