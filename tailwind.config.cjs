module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
      lineClamp: {
        10: '10',
      }
    },
  },
  prefix: "",
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@catppuccin/tailwindcss")({
      prefix: "ctp",
      defaultFlavour: "mocha",
    }),
  ],
};
