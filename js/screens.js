import { Navigation } from 'react-native-navigation';

import LaunchScreen from './common/LaunchScreen';
import LoginScreen from './common/LoginScreen';
import Notification from './common/Notification';
import GameScreen from './common/gameScreen';

// register all screens of the app (including internal ones)
export default (store, Provider) => {
  Navigation.registerComponent('CP.LoginScreen', () => LoginScreen, store, Provider);
  Navigation.registerComponent('CP.LaunchScreen', () => LaunchScreen, store, Provider);
  Navigation.registerComponent('CP.GameScreen', () => GameScreen, store, Provider);
  Navigation.registerComponent('CP.Notification', () => Notification);
}
