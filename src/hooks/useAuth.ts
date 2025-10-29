import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuthStore from '../store/authStore';
import { RootStackParamList } from '../navigation/AppNavigator';

/**
 * Hook personnalisé pour gérer l'authentification et les redirections
 */
// const useAuth = (requiredRoles?: string[]) => {
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
//   const {
//     user,
//     isAuthenticated,
//     isLoading,
//     error,
//     login,
//     register,
//     logout,
//     checkAuth,
//   } = useAuthStore();

//   useEffect(() => {
//     const verifyAuth = async () => {
//       if (isLoading) return;

//       const isAuth = await checkAuth();

//       if (!isAuth) {
//         // ⚠️ Redirection vers Login si non authentifié
//         navigation.navigate('Login');
//         return;
//       }

//       // Si l’utilisateur est connecté mais n’a pas le bon rôle
//       if (requiredRoles && requiredRoles.length > 0) {
//         const hasRequiredRole = requiredRoles.some(
//           (role) =>
//             user?.user_type?.toLowerCase() === role.toLowerCase()
//         );

//         console.log(user)
//         if (!hasRequiredRole) {
//           // 🚀 Redirection selon le rôle réel
//           switch (user?.user_type?.toLowerCase()) {
//             case 'donneur':
//               navigation.navigate('DonorDashboard');
//               break;
//             case 'docteur':
//               navigation.navigate('DoctorPage');
//               break;
//             case 'banque':
//               navigation.navigate('BloodBankDashboard');
//               break;
//             default:
//               navigation.navigate('DonorDashboard');
//           }
//         }
//       }
//     };

//     verifyAuth();
//   }, [isAuthenticated, isLoading, requiredRoles, user]);

//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     error,
//     login,
//     register,
//     logout,
//     checkAuth,
//   };
// };

// export default useAuth;
