import { createTheme } from '@mantine/core';

export const appTheme = createTheme({
  primaryColor: 'orange',
  primaryShade: { light: 7, dark: 6 },
  autoContrast: true,
  luminanceThreshold: 0.33,
  cursorType: 'pointer',

  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  headings: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '750',
    textWrap: 'balance',
  },

  defaultRadius: 'md',
  radius: {
    xs: '8px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  },

  components: {
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },

    Paper: {
      defaultProps: {
        radius: 'lg',
      },
      styles: () => ({
        root: {
          borderColor: 'var(--app-border)',
          background: 'var(--app-surface)',
          boxShadow: 'var(--mantine-shadow-sm)',
          backdropFilter: 'blur(14px)',
        },
      }),
    },

    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
      styles: () => ({
        root: {
          borderColor: 'var(--app-border)',
          background: 'var(--app-surface-strong)',
          backdropFilter: 'blur(16px)',
        },
      }),
    },

    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },

    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
    },

    ThemeIcon: {
      defaultProps: {
        radius: 'md',
      },
    },

    Select: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },

    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },

    SegmentedControl: {
      defaultProps: {
        radius: 'xl',
      },
    },

    Badge: {
      defaultProps: {
        radius: 'sm',
        variant: 'light',
      },
    },

    Code: {
      defaultProps: {
        fz: '0.95em',
      },
    },
  },
});
