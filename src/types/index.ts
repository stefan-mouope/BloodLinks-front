import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Theme types
export interface Theme {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    white: string;
    black: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    border: string;
    borderLight: string;
    borderDark: string;
  };
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
      '5xl': number;
    };
    lineHeight: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
      '5xl': number;
    };
    fontWeight: {
      normal: '400';
      medium: '500';
      semiBold: '600';
      bold: '700';
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };
  shadows: {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
  };
  dimensions: {
    screenWidth: number;
    screenHeight: number;
    isSmallScreen: boolean;
    isMediumScreen: boolean;
    isLargeScreen: boolean;
  };
  componentDimensions: {
    buttonHeight: {
      sm: number;
      md: number;
      lg: number;
    };
    inputHeight: {
      sm: number;
      md: number;
      lg: number;
    };
    cardMinHeight: number;
    cardPadding: number;
    iconSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
}

// Component prop types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export type InputSize = 'sm' | 'md' | 'lg';
export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  size?: InputSize;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
};

export type CardProps = {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
};

export type RoleType = 'docteur' | 'banque' | 'donneur';
export type RoleSelectorProps = {
  selectedRole: RoleType | null;
  onRoleSelect: (role: RoleType) => void;
  style?: ViewStyle;
};

export type RoleCardProps = {
  role: RoleType;
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

// Blood type options
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Bank data type
export type BankData = {
  id: number;
  nom: string;
  localisation: string;
};

// Screen types
export type SignUpFormData = {
  // Common fields
  email: string;
  password: string;
  user_type: RoleType;
  
  // Doctor specific fields
  nom?: string;
  prenom?: string;
  code_inscription?: string;
  banque_de_sang_id?: number;
  
  // Bank specific fields
  nom_banque?: string;
  localisation?: string;
  code_inscription_banque?: string;
  
  // Donor specific fields
  nom_donneur?: string;
  prenom_donneur?: string;
  groupe_sanguin?: BloodType;
};

export type SignUpScreenProps = {
  onSubmit: (data: SignUpFormData) => void;
  loading?: boolean;
  error?: string;
};

// Navigation types
export type AuthStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// API types
export type User = {
  id: string;
  email: string;
  role: RoleType;
  bankName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  refreshToken: string;
};

export type ApiError = {
  message: string;
  code: string;
  field?: string;
};

// Utility types
export type ResponsiveValue<T> = T | {
  small?: T;
  medium?: T;
  large?: T;
};

export type StyleProp<T> = T | ResponsiveValue<T>;

// Icon types
export type IconProps = {
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle | ImageStyle;
};

export type IconName = 
  | 'doctor'
  | 'blood-drop'
  | 'heart'
  | 'user'
  | 'email'
  | 'lock'
  | 'location'
  | 'bank'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'close'
  | 'menu'
  | 'search'
  | 'filter'
  | 'settings'
  | 'logout';

export default {
  // Export all types for easy access
};
