import { LinearProgress, createTheme, css } from '@mui/material';
import React from 'react';

const MappedColors = {
  white: '#ffffff',
  black: '#000000',

  eletricBlue: {
    main: '#4A3BCF',
    a70: '#8076DD',
    a50: '#A49DE7',
    a20: '#DBD8F5',
    a10: '#F6F5Fd',
  },
  blue: {
    main: '#4D5F80',
    a80: '#717F99',
    a60: '#A0AEC0',
    a40: '#B8BFCC',
    a10: '#EDEFF2',
  },
  slate: {
    main: '#191F2C',
    a70: '#5E626B',
    a50: '#8C8F95',
    a20: '#D1D2D5',
    a10: '#E8E9EA',
    a05: '#f6f6f6',
    a03: '#F9F9F9',
  },
  teal: {
    main: '#51C0AC',
  },
  alert: {
    main: '#F56565',
  },
  notice: {
    main: '#F2C94C',
  },
};

const buttonBase = {
  defaultProps: {
    disableElevation: true,
    disableRipple: true,
    color: 'primary',
    variant: 'contained',
    size: 'large',
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
      fontWeight: 'bold',
      borderRadius: 2,
      transition: 'none',
      lineHeight: '1',
      paddingTop: '0',
      paddingBottom: 0,
    },
    sizeLarge: {
      fontSize: 17,
      letterSpacing: -0.5,
      height: 48,
    },
    sizeMedium: {
      fontSize: 14,
      height: 35,
    },
    sizeSmall: {
      fontSize: 12,
      height: 28,
    },
    iconSizeLarge: {
      '>svg': {
        position: 'relative',
        top: -0.5,
        fontSize: '24px !important',
      },
    },
    iconSizeMedium: {
      '&.MuiButton-startIcon': {
        marginRight: 6,
      },
      '>svg': {
        position: 'relative',
        top: 0.5,
        fontSize: '22px !important',
      },
    },
    iconSizeSmall: {
      '&.MuiButton-startIcon': {
        marginRight: 3,
      },
      '>svg': {
        position: 'relative',
        top: 1.2,
        fontSize: '20px !important',
      },
    },
  },
};

const palette = {
  divider: MappedColors.slate.a10,
  background: {
    default: MappedColors.white,
    paper: MappedColors.slate.a03,
  },
  text: {
    ...MappedColors.slate,
    primary: MappedColors.slate.main,
    secondary: MappedColors.slate.a70,
    disabled: MappedColors.slate.a50,
  },
  primary: {
    ...MappedColors.eletricBlue,
    light: MappedColors.eletricBlue.a70,
  },
  secondary: {
    ...MappedColors.eletricBlue,
    contrastText: '#fff',
  },
  action: {
    hover: MappedColors.slate.a05,
  },
  success: {
    ...MappedColors.teal,
    contrastText: '#fff',
  },
  error: MappedColors.alert,
  warning: MappedColors.notice,
  info: MappedColors.blue,
};

let theme = createTheme({ palette });

const customTheme = createTheme({
  palette,
  components: {
    MuiCssBaseline: {
      styleOverrides: css`
        * {
          font-family:
            NeueHansKendrick,
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            Ubuntu,
            Cantarell,
            Noto Sans,
            sans-serif,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            'Helvetica Neue',
            Arial,
            'Noto Sans',
            sans-serif,
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji' !important;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          line-height: 1.5;
          height: 100%;
          overflow: auto;
          background-color: white;
        }

        #main-content {
          padding: 15px !important;
        }

        .RaShow-main.RaShow-noActions {
          margin-top: 0 !important;
        }

        .RaList-noResults {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
        }

        .RaList-actions {
          align-items: center !important;

          .MuiToolbar-root {
            align-items: center !important;
            padding: 4px !important;
          }

          & > form {
            min-height: 0 !important;
            padding: 0 !important;

            .MuiFormControl-root {
              margin-top: 0 !important;
            }
          }
        }
      `.styles,
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: 'none',
          borderRadius: '0',
        },
      },
    },

    MuiButton: buttonBase,

    MuiLoadingButton: {
      ...buttonBase,

      defaultProps: {
        ...buttonBase?.defaultProps,
        loadingIndicator: <LinearProgress color='inherit' />,
      },

      styleOverrides: {
        ...buttonBase?.styleOverrides,

        root: {
          ...buttonBase?.styleOverrides?.root,

          '.MuiLinearProgress-root': {
            width: '100%',
          },

          '.MuiLoadingButton-loadingIndicator': {
            width: '50%',
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: 6,
          fontSize: 11,
        },
      },
    },

    MuiInputLabel: {
      defaultProps: {
        variant: 'outlined',
        disableAnimation: true,
        shrink: true,
      },

      styleOverrides: {
        root: {
          transform: 'none',
          fontWeight: 'bold',
          display: 'block',
          position: 'unset',
          lineHeight: 1,
          fontSize: 14,
          color: theme.palette.text.primary,
          marginBottom: 5,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        color: 'primary',
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderWidth: '1px !important',
          borderColor: theme.palette.text.disabled,
        },

        root: {
          'borderRadius': 2,
          'height': 48,
          'fontSize': 16,
          'lineHeight': 1,
          'background': theme.palette.background.default,

          '&.MuiInputBase-multiline': {
            height: 'auto',
          },

          '.MuiInputAdornment-root': {
            color: theme.palette.text.disabled,
            marginRight: 4,
          },

          '&.Mui-focused .MuiInputAdornment-root': {
            color: theme.palette.primary.main,
          },

          'input': {
            padding: '14px 16px',
            fontSize: 16,
            height: 'auto',
          },

          '&.MuiInputBase-sizeSmall': {
            'height': 32,
            'lineHeight': 1,
            'fontSize': 14,

            'input': {
              padding: '7px 10px',
              fontSize: 14,
              height: 'auto',
            },

            '.MuiInputAdornment-root': {
              marginRight: 0,

              svg: {
                width: 18,
                height: 18,
              },
            },
          },

          'fieldset legend': {
            maxWidth: '0.01px !important',
          },

          '&.Mui-focused .MuiSelect-iconOutlined': {
            color: theme.palette.primary.main,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          background: theme.palette.background.default,
          borderRadius: 2,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 6px 0px',
          border: `1px solid ${theme.palette.divider}`,
        },
      },
    },

    MuiSelect: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        select: {
          minHeight: 0,
        },
      },
    },

    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            background: theme.palette.action.hover + ' !important',
          },
          '&[role="option"]': {
            paddingTop: 12,
            paddingBottom: 12,
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          '&, *': {
            color: theme.palette.primary.light + '!important',
          },

          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          'borderColor': theme.palette.divider,

          'th': {
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
          },

          'th, td': {
            border: 'none',
          },

          'tbody tr:nth-child(even)': {
            backgroundColor: '#F9F9F9',
          },

          'tr:hover': {
            backgroundColor: 'rgba(74,59,207,0.05) !important',
          },
        },
      },
    },
  },
});

export default customTheme;
