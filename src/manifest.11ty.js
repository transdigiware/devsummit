module.exports = class Manifest {
  data() {
    return {
      permalink: 'manifest.json',
    };
  }
  render() {
    return JSON.stringify(
      {
        name: 'Chrome Dev Summit 2020',
        short_name: 'CDS 2020',
        start_url: '/devsummit/',
        display: 'standalone',
        background_color: '#f8f9fa',
        theme_color: '#f8f9fa',
        icons: [
          {
            src: 'confboxAsset(/assets/pwa.png)',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'confboxAsset(/assets/pwa-large.png)',
            type: 'image/png',
            sizes: '1024x1024',
          },
          {
            src: 'confboxAsset(/assets/pwa.png)',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: 'confboxAsset(/assets/pwa-large.png)',
            type: 'image/png',
            sizes: '1024x1024',
            purpose: 'maskable',
          },
        ],
      },
      null,
      '  ',
    );
  }
};
