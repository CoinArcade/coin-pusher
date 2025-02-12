import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text
} from "react-native";
import { List, ListItem } from "react-native-elements";
import { loggedOut, toggleBGM } from "../actions";
import { connect } from "react-redux";
import ScreenComponent from "./ScreenComponent";
import F8Colors from "./F8Colors";
import codePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";
import { codePushSync, installCodePush, toastShow } from "../util";

class OptionScreen extends ScreenComponent {
  constructor(props) {
    super(props);

    this.state = {
      jsVersion: "",
      checkUpdating: false
    };
  }

  static navigatorStyle = {
    navBarTextColor: "#ffffff",
    navBarBackgroundColor: F8Colors.mainBgColor2,
    navBarButtonColor: "#ffffff"
  };

  componentDidMount() {
    codePush.getUpdateMetadata(codePush.UpdateState.RUNNING).then((update) => {
      if (update) {
        this.setState({jsVersion:update.label});
      }
    });
  }

  toggleSound = (soundEnable) => {
    this.props.dispatch(toggleBGM(soundEnable));
  }

  pressLogout = () => {
    this.props.dispatch(loggedOut());
  }

  pressCheckUpdate = async () => {
    try {
      await this.setState({checkUpdating: true});
      let num = await codePushSync();
      if (num == codePush.SyncStatus.UP_TO_DATE) {
        toastShow("已经是最新版本");
      }
      console.log("checkUpdate num:" + num);
      await installCodePush();
    } catch (e) {
      console.warn("CheckUpdate err:" + e.message);
    } finally {
      await this.setState({checkUpdating: false});
    }
  }

  renderLoading = () => {
    if (this.state.checkUpdating) {
      return (
        <View style={{
          flex: 0,
          position: "absolute",
          left:0,
          top:0,
          width: "100%",
          height: "100%",
          justifyContent:"center",
          alignItems:"center",
          alignContent:"center",
          backgroundColor: "#00000088"
        }}>
          <Text style={{
            color:"white",
            fontSize:13,
          }}>
            检测中
          </Text>
          <ActivityIndicator animating size="large" color='white'/>
        </View>
      );
    }
    else {
      return;
    }
  }

  renderBtn = () => {
    return (
      <List containerStyle={styles.listContainer}>
        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
          titleStyle={{color: "#d1d3e8", fontSize: 15}}
          key={1}
          title={"声音"}
          hideChevron={true}
          switchButton={true}
          onSwitch={this.toggleSound}
          switchDisabled={false}
          switched={this.props.bgmEnabled}
        />

        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
          titleStyle={{color: "#d1d3e8", fontSize: 15}}
          key={2}
          title={"版本"}
          hideChevron={true}
          rightTitle={DeviceInfo.getVersion() + "/" + this.state.jsVersion}
          //rightTitle={item.sendTime}
          //rightTitleNumberOfLines={2}
        />

        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2}}
          titleStyle={{color: "#d1d3e8", fontSize: 15}}
          key={3}
          title={"检测新版本并更新"}
          hideChevron={true}
          onPress={this.pressCheckUpdate}
        />

        <ListItem
          containerStyle={{borderTopWidth: 0, borderBottomWidth: 1, borderBottomColor: F8Colors.mainBgColor2, backgroundColor:"#ee4943"}}
          titleStyle={{color: "#d1d3e8", fontSize: 15}}
          key={4}
          title={"退出登录"}
          hideChevron={true}
          onPress={this.pressLogout}
        />
      </List>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderBtn()}
        {this.renderLoading()}
      </View>
    );
  }
}

/* StyleSheet
============================================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: F8Colors.mainBgColor,
    //height: '100%',
  },
  header: {
    width: "100%",
    //height: 150,
    paddingBottom: 15,
    backgroundColor: F8Colors.mainBgColor2,
    flexDirection: "row",
  },
  currContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: F8Colors.mainBgColor2,
    //justifyContent: 'center',
    //alignContent: 'center',
    alignItems: "center",
    justifyContent: "space-between",
  },
  listContainer: {
    flex: 1,
    //height: '100%',
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderBottomColor: "#45474D",
    backgroundColor: F8Colors.mainBgColor,
  }
});

function select(store: Object): Object {
  return {
    bgmEnabled: store.user.bgmEnabled
  };
}

/* exports ================================================================== */
module.exports = connect(select)(OptionScreen);
