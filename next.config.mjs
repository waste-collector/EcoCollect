/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
    }
  },
  transpilePackages: ['xml2js', 'fast-xml-parser']
}

export default nextConfig
