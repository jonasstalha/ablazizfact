module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          600: '#4F46E5',  // Primary indigo color
          700: '#3730A3',  // Darker indigo for hover and active states
        },
        green: {
          600: '#10B981',  // Green color for action buttons
          700: '#059669',  // Darker green for hover
        },
        gray: {
          50: '#F9FAFB',  // Light background
          100: '#F3F4F6', // Light gray for borders
          200: '#E5E7EB', // Mid gray
          300: '#D1D5DB', // Darker gray
          800: '#1F2937', // Dark gray text
        },
      },
      spacing: {
        '128': '32rem',  // Custom spacing for larger layouts
        '96': '24rem',   // For medium spacing
        '72': '18rem',   // Smaller spacing
      },
      fontSize: {
        '4xl': '2.25rem', // Larger heading text
        '2xl': '1.5rem',  // Subheading size
        'lg': '1.125rem', // Text size for labels
      },
      borderRadius: {
        'lg': '1rem',  // Rounded corners for buttons and cards
      },
      boxShadow: {
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)', // Strong shadow for focus and cards
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Modern font choice
      },
    },
  },
  plugins: [],
}
