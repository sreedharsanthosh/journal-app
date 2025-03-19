/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						h1: { marginBottom: '0.5rem' },
						h2: { marginBottom: '0.4rem' },
						h3: { marginBottom: '0.3rem' },
						p: { marginBottom: '0.25rem' },
						ul: { marginBottom: '0.25rem' },
						ol: { marginBottom: '0.25rem' },
						blockquote: { marginBottom: '0.5rem' }
					}
				}
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
