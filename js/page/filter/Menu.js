import React , { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  DeviceEventEmitter
} from 'react-native';


import FilterMenuItem from '../../common/FilterMenuItem';
import RecruitDao from '../../expand/dao/recruitDao';

const window = Dimensions.get('window');



export default class Menu extends Component {
  constructor(props){
    super(props);
    this.recruitDao = new RecruitDao();
    this.state = {
      dataList:[],
      index:0
    }
  }

  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };




  _loadGetRecruitSecondMenu(id){
      this.recruitDao.getRecruitSecondMenu(id)
        .then(res =>{
          res.unshift({name:'全部',id:id});
          this.setState({
            dataList:res
          });
        })
        .catch((error) => {
          console.log(error)
        })
  }

  componentDidMount(){
    this._loadGetRecruitSecondMenu(1);
    this.listener = DeviceEventEmitter.addListener('choiceIndex',function(index){

      this._loadGetRecruitSecondMenu(index)
    }.bind(this))
  }

  componentWillUnmount(){
    this.listener.remove();  
  }

  render() {
    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
            <FilterMenuItem dataType={this.props.dataType} userInfo = {this.props.userInfo} position = {this.props.position} 
              navigator={this.props.navigator} dataList={this.state.dataList} pageType = 'sub'/>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#D1D1D1',
  },
  avatarContainer: {
    borderLeftWidth:1,
    borderColor:'#D1D1D1'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20,
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});
