
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  	extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        arabic: ["'Al Majeed Quranic Font'", "var(--font-geist-sans)", "serif"],
        urdu: ["'Jameel Noori Nastaleeq'", "var(--font-geist-sans)", "serif"],
        'roman-urdu': ["var(--font-roboto)", "var(--font-poppins)", "sans-serif"],
      },
  		colors: {
  			background: 'hsl(var(--background-hsl) / <alpha-value>)',
  			foreground: 'hsl(var(--foreground-hsl) / <alpha-value>)',
  			card: {
  				DEFAULT: 'hsl(var(--card-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--card-foreground-hsl) / <alpha-value>)'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--popover-foreground-hsl) / <alpha-value>)'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--primary-foreground-hsl) / <alpha-value>)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--secondary-foreground-hsl) / <alpha-value>)'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--muted-foreground-hsl) / <alpha-value>)'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--accent-foreground-hsl) / <alpha-value>)'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive-hsl) / <alpha-value>)',
  				foreground: 'hsl(var(--destructive-foreground-hsl) / <alpha-value>)'
  			},
  			border: 'hsl(var(--border-hsl) / <alpha-value>)',
  			input: 'hsl(var(--input-hsl) / <alpha-value>)',
  			ring: 'hsl(var(--ring-hsl) / <alpha-value>)',
  			chart: {
  				'1': 'hsl(var(--chart-1) / <alpha-value>)',
  				'2': 'hsl(var(--chart-2) / <alpha-value>)',
  				'3': 'hsl(var(--chart-3) / <alpha-value>)',
  				'4': 'hsl(var(--chart-4) / <alpha-value>)',
  				'5': 'hsl(var(--chart-5) / <alpha-value>)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background) / <alpha-value>)',
  				foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
  				primary: 'hsl(var(--sidebar-primary) / <alpha-value>)',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
  				accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
  				border: 'hsl(var(--sidebar-border) / <alpha-value>)',
  				ring: 'hsl(var(--sidebar-ring) / <alpha-value>)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

    