// screens/Home/types.ts
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  FirstPage: undefined;
  Login: undefined;
  SignUp: undefined;
};

export type FirstPageScreenRouteProp = RouteProp<RootStackParamList, 'FirstPage'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;