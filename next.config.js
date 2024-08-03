const path = require('path');

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/avatars/**'
      }
    ]
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
  }
}
