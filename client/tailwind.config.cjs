const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
