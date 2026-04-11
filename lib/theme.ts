// Material 3 teal palette — matches the Stitch mockups.
export const colors = {
  primary: '#004d5b',
  primaryContainer: '#006778',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#97e3f6',
  primaryFixed: '#a9edff',
  primaryFixedDim: '#86d2e5',
  onPrimaryFixed: '#001f26',
  onPrimaryFixedVariant: '#004e5c',

  secondary: '#0f6a5f',
  secondaryContainer: '#a0eedf',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#176e63',
  secondaryFixed: '#a3f1e2',
  secondaryFixedDim: '#87d5c6',
  onSecondaryFixed: '#00201c',
  onSecondaryFixedVariant: '#005047',

  tertiary: '#6d3800',
  tertiaryContainer: '#8f4c00',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#ffcda8',
  tertiaryFixed: '#ffdcc3',
  tertiaryFixedDim: '#ffb77d',
  onTertiaryFixed: '#2f1500',
  onTertiaryFixedVariant: '#6e3900',

  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  background: '#f7f9fb',
  surface: '#f7f9fb',
  surfaceBright: '#f7f9fb',
  surfaceDim: '#d8dadc',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  surfaceContainerHighest: '#e0e3e5',
  surfaceVariant: '#e0e3e5',

  onBackground: '#191c1e',
  onSurface: '#191c1e',
  onSurfaceVariant: '#3f484b',
  outline: '#6f797c',
  outlineVariant: '#bec8cb',

  inverseSurface: '#2d3133',
  inverseOnSurface: '#eff1f3',
  inversePrimary: '#86d2e5',

  // Stroop game — saturated distinct hues required by the Stroop effect.
  // These are semantic game colors, not UI chrome. Do NOT reuse as UI accents.
  stroopRed: '#E53935',
  stroopBlue: '#1E88E5',
  stroopGreen: '#43A047',
  stroopYellow: '#FDD835',
};

export const fonts = {
  headline: 'System', // swap to 'Manrope' once font is loaded
  body: 'System', // swap to 'Public Sans' once font is loaded
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  xxl: 32,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const type = {
  displayLg: { fontSize: 36, fontWeight: '800' as const, lineHeight: 40 },
  headlineLg: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  headlineMd: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  headlineSm: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  titleLg: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  labelLg: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  labelMd: { fontSize: 11, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 0.8 },
};

export const shadow = {
  card: {
    shadowColor: '#191c1e',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  soft: {
    shadowColor: '#191c1e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};
