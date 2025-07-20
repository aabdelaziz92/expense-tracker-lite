export default {
    content: [
        "./src/**/*.{html,ts}"
    ],
    theme: {
        extend: {
            colors: { //https://uicolors.app/generate
                primary: {
                    dark: "#1E55F3",
                    light: "#496EF3"
                },
                'blue-ribbon': {
                    '50': '#eef5ff',
                    '100': '#dae8ff',
                    '200': '#bcd7ff',
                    '300': '#8fbfff',
                    '400': '#5a9bff',
                    '500': '#3375fe',
                    '600': '#1e55f3',
                    '700': '#153fe0',
                    '800': '#1834b5',
                    '900': '#1a328e',
                    '950': '#152056',
                },
                error: "#F44336",
                success: "#4CAF50",
                warning: "#FF9800",
                info: "#2196F3",
                background: "#FDFDFD",
                input: {
                    background: "#F5F6FA"
                },
                txt: {
                    primary: "#212121",
                    secondary: "#757575",
                    disabled: "#BDBDBD",
                    light: "#FFFFFF",
                    dark: "#000000",
                    main: "#1E55F3",
                    link: "#1E55F3",
                    linkHover: "#1A4BCF",
                    linkActive: "#163F9F",
                },
            },
        },
    },
    plugins: [],
}

// --color-blue-ribbon-50: #eef5ff;
// --color-blue-ribbon-100: #dae8ff;
// --color-blue-ribbon-200: #bcd7ff;
// --color-blue-ribbon-300: #8fbfff;
// --color-blue-ribbon-400: #5a9bff;
// --color-blue-ribbon-500: #3375fe;
// --color-blue-ribbon-600: #1e55f3;
// --color-blue-ribbon-700: #153fe0;
// --color-blue-ribbon-800: #1834b5;
// --color-blue-ribbon-900: #1a328e;
// --color-blue-ribbon-950: #152056;