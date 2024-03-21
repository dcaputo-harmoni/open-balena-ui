import { LinearProgress, createTheme, css } from '@mui/material';
import React from 'react';

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
  chip: {
    background: '#c3efff',
    color: '#006387',
  },
  text: {
    primary: '#23445e',
  },
  primary: {
    main: '#2a506f',
    contrastText: '#fff',
  },
  secondary: {
    main: '#1496e1',
    contrastText: '#fff',
  },
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

        .RaLayout-appFrame {
          margin-top: 70px !important;
        }

        #main-content {
          background: #f8f9fd !important;
          padding: 15px !important;
        }

        .RaShow-main,
        .RaCreate-main,
        .RaEdit-main {
          margin-top: 0 !important;
        }

        .edit-page,
        .create-page {
          height: 100%;
        }

        .RaCreate-main,
        .RaEdit-main {
          display: flex;
          width: 100%;
          align-items: center !important;
          justify-content: center !important;
          height: 100%;

          > div {
            padding: 30px;
            max-width: 800px;
          }
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

        .RaCreate-main,
        .RaEdit-main {
          .MuiToolbar-root {
            min-height: 0 !important;
            padding: 16px !important;
            background: none !important;
          }

          .RaToolbar-defaultToolbar {
            display: flex;
            justify-content: flex-end !important;

            button {
              flex: 1;
            }

            .ra-delete-button {
              display: none;
            }
          }
        }

        .RaDatagrid-tableWrapper {
          td {
            .MuiToolbar-root {
              min-height: 0 !important;
              padding: 0 !important;
              justify-content: flex-end !important;

              .MuiButtonBase-root {
                min-width: 0 !important;
                margin-left: 10px !important;
              }

              .MuiButton-icon,
              button > svg {
                margin: 0 !important;
              }
            }
          }
        }
      `.styles,
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          'background': theme.palette.text.primary,
          'border': 'none',
          'borderRadius': '0',
          'boxShadow': 'none',
          'height': '70px',
          'justifyContent': 'center',

          '.RaAppBar-menuButton': {
            display: 'none',
          },

          '.logo': {
            width: '200px',
            marginLeft: '5px',
          },

          '#react-admin-title': {
            textAlign: 'center',
            fontWeight: 'bold',
            marginLeft: '75px',
          },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          backgroundColor: '#f2f4fa',
        },
      },
    },

    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          'background': theme.palette.chip.background,
          'border': 'none',

          '.MuiChip-label, .MuiChip-icon': {
            'color': theme.palette.chip.color + '!important',

            '&.MuiChip-labelSmall': {
              padding: '0 12px',
            },
          },
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
            color: theme.palette.secondary.main + '!important',
          },

          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiTable: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          'borderColor': theme.palette.divider,

          'th': {
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            backgroundColor: '#f2f4fa !important',
          },

          'th, td': {
            border: 'none',
          },

          'tbody tr:nth-child(even)': {
            backgroundColor: '#f8f9fd',
          },

          'tr:hover': {
            backgroundColor: 'rgba(51, 219, 238, 0.07)' + '!important',
          },
        },
      },
    },
  },
});

export default customTheme;
