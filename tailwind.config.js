/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        excel: {
          primary: '#16a34a',      
          hover: '#15803d',        
          light: '#dcfce7',       
          lighter: '#f0fdf4',      
          dark: '#1f2937',        
          text: '#374151',        
          gray: '#6b7280',       
          muted: '#9ca3af',       
          border: '#d1d5db',
          bg: '#f9fafb',           
          section: '#f0fdf4',      
          declaration: '#ecfdf5',  
        }
      }
    },
  },
  plugins: [],
}