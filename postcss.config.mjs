/** @type {import('postcss-load-config').Config} */

const config = {
  plugins: {
    'postcss-url': {
      url: (asset) => {
        // Only add prefix for absolute paths starting with '/'
        if (asset.url.startsWith('/') && process.env.NODE_ENV === 'production') {
          return `/formatter${asset.url}`;
        }
        return asset.url;
      }
    },
    tailwindcss: {},
  },
};

export default config;
