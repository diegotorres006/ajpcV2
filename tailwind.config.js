module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "jpc-blue": "#0046ad", // Azul médico sólido
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        medical: {
          "primary": "#0046ad",   /* Azul Institucional */
          "secondary": "#0d47a1", /* Azul oscuro */
          "accent": "#28a745",    /* Verde mantenimiento */
          "neutral": "#1f2937",   /* Gris oscuro para texto */
          "base-100": "#ffffff",  /* Fondo blanco */
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}
