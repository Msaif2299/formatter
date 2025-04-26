/** @type {import('postcss-load-config').Config} */

const config = {
  plugins: {
    'postcss-url': {
      url: (asset) => {
        // Only add prefix for absolute paths starting with '/'
        if (asset.url.startsWith('/')) {
          return `/formatter${asset.url}`;
        }
        return asset.url;
      }
    },
    tailwindcss: {},
  },
};

export default config;
