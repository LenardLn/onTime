declare module 'react-native' {
  import type {ComponentType, ReactNode} from 'react';

  export type StyleProp<T> = T | T[] | false | null | undefined;

  export const View: ComponentType<{
    style?: StyleProp<object>;
    children?: ReactNode;
  }>;

  export const Text: ComponentType<{
    style?: StyleProp<object>;
    children?: ReactNode;
  }>;

  export const TextInput: ComponentType<{
    style?: StyleProp<object>;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
  }>;

  export const Pressable: ComponentType<{
    style?: StyleProp<object>;
    onPress?: () => void;
    disabled?: boolean;
    children?: ReactNode;
  }>;

  export const SafeAreaView: ComponentType<{
    style?: StyleProp<object>;
    children?: ReactNode;
  }>;

  export const StatusBar: ComponentType<{
    barStyle?: 'default' | 'light-content' | 'dark-content';
    backgroundColor?: string;
  }>;

  export const ActivityIndicator: ComponentType<{color?: string}>;

  export const KeyboardAvoidingView: ComponentType<{
    style?: StyleProp<object>;
    behavior?: 'height' | 'position' | 'padding' | undefined;
    children?: ReactNode;
  }>;

  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
  };

  export const PermissionsAndroid: {
    PERMISSIONS: {ACCESS_FINE_LOCATION: string};
    RESULTS: {GRANTED: string; DENIED: string};
    request: (
      permission: string,
      rationale?: {
        title: string;
        message: string;
        buttonPositive: string;
      },
    ) => Promise<string>;
  };

  export const StyleSheet: {
    create<T extends Record<string, object>>(styles: T): T;
  };

  export const AppRegistry: {
    registerComponent: (
      name: string,
      component: () => ComponentType<unknown>,
    ) => void;
  };
}
