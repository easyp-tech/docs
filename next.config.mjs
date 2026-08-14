import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  reactStrictMode: true,
  async redirects() {
    return [
      // Flattened IA: drop /guide/ prefix
      {
        source: '/docs/guide/:path*',
        destination: '/docs/:path*',
        permanent: true,
      },
      // Deduped leaf pages
      {
        source: '/docs/cli/linter/linter',
        destination: '/docs/cli/linter',
        permanent: true,
      },
      {
        source: '/docs/cli/breaking-changes/breaking-changes',
        destination: '/docs/cli/breaking-changes',
        permanent: true,
      },
      {
        source: '/docs/cli/generator/generator',
        destination: '/docs/cli/generator',
        permanent: true,
      },
      {
        source: '/docs/cli/package-manager/package-manager',
        destination: '/docs/cli/package-manager',
        permanent: true,
      },
      {
        source: '/docs/cli/configuration/configuration',
        destination: '/docs/cli/configuration',
        permanent: true,
      },
      {
        source: '/docs/cli/auto-completion/auto-completion',
        destination: '/docs/cli/auto-completion',
        permanent: true,
      },
      // RU locale (hideLocale default-locale → /ru/docs/...)
      {
        source: '/ru/docs/guide/:path*',
        destination: '/ru/docs/:path*',
        permanent: true,
      },
      {
        source: '/docs/ru-guide/:path*',
        destination: '/ru/docs/:path*',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/linter/linter',
        destination: '/ru/docs/cli/linter',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/breaking-changes/breaking-changes',
        destination: '/ru/docs/cli/breaking-changes',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/generator/generator',
        destination: '/ru/docs/cli/generator',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/package-manager/package-manager',
        destination: '/ru/docs/cli/package-manager',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/configuration/configuration',
        destination: '/ru/docs/cli/configuration',
        permanent: true,
      },
      {
        source: '/ru/docs/cli/auto-completion/auto-completion',
        destination: '/ru/docs/cli/auto-completion',
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
