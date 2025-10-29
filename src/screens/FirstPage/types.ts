// screens/Home/types.ts
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  FirstPage: undefined;
  Login: undefined;
  SignUp: undefined;
  DoctorPage: undefined;
  CreateRequest:undefined;
  bloodbank:undefined;
  donor: undefined;
  donorprofile:undefined;
  doctorprofile:undefined;
  bankprofile:undefined;
  Onboarding: {step: number},
  Home:undefined
};

export type FirstPageScreenRouteProp = RouteProp<RootStackParamList, 'FirstPage'>;
export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;
export type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp'>;
export type DoctorPageRouteProp = RouteProp<RootStackParamList, 'DoctorPage'>;
export type CreateRequestScreenPageRouteProp = RouteProp<RootStackParamList, 'CreateRequest'>;
export type bloodbankRouteProp = RouteProp<RootStackParamList, 'bloodbank'>;
export type donorRouteProp = RouteProp<RootStackParamList, 'donor'>;
export type donorprofileRouteProp = RouteProp<RootStackParamList, 'donorprofile'>;
export type doctorprofileRouteProp = RouteProp<RootStackParamList, 'doctorprofile'>;
export type bankprofileRouteProp = RouteProp<RootStackParamList, 'bankprofile'>;
export type OnboardingRouteProp = RouteProp<RootStackParamList, 'Onboarding'>;









