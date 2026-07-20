import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const githubPagesAssetPaths = () => ({
  name: 'github-pages-asset-paths',
  apply: 'build',
  renderChunk(code) {
    return {
      code: code
        .replaceAll('"/assets/', '"/2107/assets/')
        .replaceAll("'/assets/", "'/2107/assets/")
        .replaceAll('`/assets/', '`/2107/assets/'),
      map: null,
    }
  },
})

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/2107/' : '/',
  plugins: [react(), githubPagesAssetPaths()],
}))
