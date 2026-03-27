/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				wata: {
					pink: '#ff6b9e',
					lightPink: '#ffe4f0',
					purple: '#b588f7',
					cyan: '#4de1c1',
					yellow: '#ffdc5e',
					dark: '#2d3436',
					bg: '#fbf7fb'
				}
			},
			boxShadow: {
				'wata': '0 8px 25px -5px rgba(255, 107, 158, 0.2)',
				'wata-hover': '0 12px 30px -5px rgba(181, 136, 247, 0.4)',
			}
		},
	},
	plugins: [],
}