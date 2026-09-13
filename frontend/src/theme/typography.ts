const typography = {
  fontFamily: [
    "Inter",
    "Roboto",
    "Arial",
    "sans-serif",
  ].join(","),

  fontSize: 14,

  htmlFontSize: 16,

  h1: {
    fontSize: "2.5rem",
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  h2: {
    fontSize: "2rem",
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: "-0.015em",
  },

  h3: {
    fontSize: "1.75rem",
    lineHeight: 1.3,
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  h4: {
    fontSize: "1.5rem",
    lineHeight: 1.35,
    fontWeight: 700,
  },

  h5: {
    fontSize: "1.25rem",
    lineHeight: 1.4,
    fontWeight: 600,
  },

  h6: {
    fontSize: "1.125rem",
    lineHeight: 1.45,
    fontWeight: 600,
  },

  subtitle1: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 500,
  },

  subtitle2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
    fontWeight: 600,
  },

  body1: {
    fontSize: "1rem",
    lineHeight: 1.6,
    fontWeight: 400,
  },

  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
    fontWeight: 400,
  },

  button: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
    fontWeight: 600,
    textTransform: "none" as const,
  },

  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.4,
    fontWeight: 400,
  },

  overline: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
};

export default typography;