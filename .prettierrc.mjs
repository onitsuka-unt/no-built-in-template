/** @type {import("prettier").Config} */
export default {
  printWidth: 250,
  tabWidth: 2,
  singleQuote: true,
  endOfLine: 'lf',
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
