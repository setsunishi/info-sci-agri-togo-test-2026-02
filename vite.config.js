import { defineConfig } from 'vite'

export default defineConfig({
    // GitHub Pagesでデプロイする場合、リポジトリ名を /リポジトリ名/ の形式で指定します
    // 例: https://username.github.io/lab_website/ の場合は '/lab_website/'
    base: './',
    build: {
        outDir: 'dist',
    }
})
