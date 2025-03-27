import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    GOOGLE_APPLICATION_CREDENTIALS_PATH: path.join(__dirname, 'taskflow_keys.json')
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        stream: false,
        crypto: false
      }
    }
    return config
  }
}

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return

  for (const key in userConfig) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

mergeConfig(nextConfig, userConfig)

// Verify credentials in production
if (process.env.NODE_ENV === 'production') {
  try {
    await fs.access(path.join(__dirname, 'taskflow_keys.json'))
    console.log('✓ Google Cloud credentials file found')
  } catch (error) {
    console.error('✗ ERROR: google-credentials.json not found at project root')
    console.error('Please ensure the file exists with proper permissions')
    process.exit(1)
  }
}

export default nextConfig