import {
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";

export const createAppTheme = (
  mode: PaletteMode = "light"
) => {
  return createTheme({
    palette: {
      mode,

      primary: {
        main: "#1976d2",
      },

      secondary: {
        main: "#9c27b0",
      },

      success: {
        main: "#2e7d32",
      },

      warning: {
        main: "#ed6c02",
      },

      error: {
        main: "#d32f2f",
      },

      info: {
        main: "#0288d1",
      },

      background:
        mode === "light"
          ? {
              default: "#f5f7fa",
              paper: "#ffffff",
            }
          : {
              default: "#121212",
              paper: "#1e1e1e",
            },
    },

    typography: {
      fontFamily: [
        "Inter",
        "Roboto",
        "Arial",
        "sans-serif",
      ].join(","),

      h1: {
        fontWeight: 700,
      },

      h2: {
        fontWeight: 700,
      },

      h3: {
        fontWeight: 700,
      },

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      h6: {
        fontWeight: 600,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 8,
    },

    spacing: 8,

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },

        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0 2px 10px rgba(0, 0, 0, 0.06)"
                : "0 2px 10px rgba(0, 0, 0, 0.3)",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },

      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
      },
    },
  });
};

export const lightTheme = createAppTheme("light");

export const darkTheme = createAppTheme("dark");

export default lightTheme;