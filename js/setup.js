/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 */
"use strict";

// Depdencies
import React from "react";
//import FacebookSDK from "./FacebookSDK";
//import Parse from "parse/react-native";
import configureStore from "./store/configureStore";
import { Provider } from "react-redux";
import registerScreens from "./screens";
import { configureListener } from "./configureListener";
// Components
import { Text, Alert } from "react-native";
//import F8App from "./F8App";
import LaunchScreen from "./common/LaunchScreen";
import { Navigation } from 'react-native-navigation';
import { APIRequest, configureAPIToken } from './api';

// Config
//import { serverURL, parseAppID } from "./env";

//console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false;

export default class Root extends React.Component {
  state: {
    isLoading: boolean,
    store: any
  };

  constructor(props) {
    super(props);
    this.state = {
      storeCreated: false,
      storeRehydrated: false,
      store: null
    };

    //const stores = configureStore()
    //console.error('this.state:' + Object.values(stores))
    //registerScreens(stores, Provider);

    configureStore(
      // rehydration callback (after async compatibility and persistStore)
      (store, didReset) => {
            this.setState({ storeRehydrated: true });
            this.setState({ store, storeCreated: true });
            registerScreens(store, Provider);

            //init native event listener
            configureListener(store);
            configureAPIToken(store.getState().user.token);

            let bLogin = store.getState().user.token && store.getState().user.token.length != 0;

              Navigation.startTabBasedApp({
                  tabs: [
                  {
                    label: '大厅',
                    screen: 'CP.MainScreen',
                    icon: require('./common/img/buttons/hall.png'),
                    selectedIcon: require('./common/img/buttons/hall_2.png'),
                    title: '欢乐马戏城',
                    navigatorStyle: {
                      navBarHidden: false
                    }
                  },
                  {
                      label: '商城',
                      screen: 'CP.LaunchScreen',
                      icon: require('./common/img/buttons/shop.png'),
                      selectedIcon: require('./common/img/buttons/shop_2.png'),
                      title: '商城',
                      navigatorStyle: {
                        navBarHidden: true
                      }
                  },
                  {
                      label: '我的',
                      screen: 'CP.LaunchScreen',
                      icon: require('./common/img/buttons/my.png'),
                      selectedIcon: require('./common/img/buttons/my_2.png'),
                      title: '个人资料',
                      navigatorStyle: {
                        navBarHidden: true
                      }
                  },
                  ],
                  passProps: {loggedIn: bLogin}, // simple serializable object that will pass as props to all top screens (optional)
                  animationType: 'fade',
                  tabsStyle: { // optional, **iOS Only** add this if you want to style the tab bar beyond the defaults
                    tabBarBackgroundColor: '#373a41',
                    //tabBarLabelColor: '#ffffff',
                    //tabBarButtonColor: '#ffffff', // change the color of the tab icons and text (also unselected)
                    tabBarSelectedButtonColor: '#ffffff',
                  }
              });
          }
        )
  }

  componentDidMount() {

  }
}
