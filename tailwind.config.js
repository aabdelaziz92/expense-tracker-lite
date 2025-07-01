export default {
    content: [
        "./src/**/*.{html,ts}"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    dark: "#1E55F3",
                    light: "#496EF3"
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