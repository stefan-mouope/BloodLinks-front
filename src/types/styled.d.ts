import 'styled-components';
import { Theme as PaperTheme } from 'react-native-paper';

declare module 'styled-components' {
  export interface DefaultTheme extends PaperTheme {
    // Vous pouvez ajouter des propriétés personnalisées ici
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
  }
}
