/**
 * Disable Next's Tailwind auto-detection by providing our own PostCSS config.
 * Only use autoprefixer; no Tailwind here.
 */
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};

