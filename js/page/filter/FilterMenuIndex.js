import React , {Component} from 'react';
import SideMenu from 'react-native-side-menu';
import Menu from './Menu';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';


import FilterMenuItem from '../../common/FilterMenuItem';

 export default class FilterMenuIndex extends Component {
  state = {
    isOpen: false,
    selectedItem: 'About',
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected = (item) => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }

  openSubMenu(flag){
    this.setState({
      isOpen:flag
    });
  }

  render() {
    const menu = <Menu dataType={this.props.dataType} position = {this.props.position} userInfo = {this.props.userInfo} navigator={this.props.navigator} onItemSelected={this.onMenuItemSelected} />;
    return (
        <SideMenu
          menu={menu}
          menuPosition={'right'}
          isOpen={this.state.isOpen}
          onChange={(isOpen) => this.updateMenuState(isOpen)}>
          <View style={styles.container}>
              <FilterMenuItem dataType={this.props.dataType} position = {this.props.position} userInfo = {this.props.userInfo}
               navigator={this.props.navigator} openSubMenu={this.openSubMenu.bind(this)} pageType={this.props.pageType} dataList = {this.props.dataList}/>
          </View>
        </SideMenu>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container: {
    flex: 1,
   
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});