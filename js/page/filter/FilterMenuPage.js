import React,{Component} from 'react';
import{
	Text,
	View,
	StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import SideMenu from 'react-native-side-menu';  
import FilterMenuIndex from './FilterMenuIndex';
import NavigationBar from '../../common/NavigationBar';
import RecruitDao from '../../expand/dao/recruitDao';
export default class FilterMenuPage extends Component {
  constructor(props){
    super(props);
    this.recruitDao = new RecruitDao();
    this.state = {
      isLoading:true,
      dataList:[]

    }
  }

  _pop(){
    this.props.navigator.jumpBack();
  }

  _loadIndustry(type){  
    this.recruitDao.getRecruitMenu(type)
      .then(res => {
        console.log(res)
        res.unshift({name:'全部',id:0})
        this.setState({
          dataList:res,
          pageType:'all',

        });
      })
      .catch((error) => {
        console.log(error)
      })
  }



  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        isLoading:false
      });
    },1000);
    let title = this.props.title;
    let type ;
    switch(title){
        case '全职招聘': 
           type='all'
           break;
        case '兼职招聘':
            type='part'
            break;
        case '租房':
            type='rent';
            this.setState({dataList:[{name:'长租房',id:'1'},{name:'日租房',id:'2'},{name:'月租房',id:'3'},{name:'便民用品',id:'4'}]});
            return 
    }
    this._loadIndustry(type);
   
   
  }

  render() {
    let pageType = this.props.title === '全职招聘' ? 'first' : 'sub' ;
    let dataType = this.props.title === '全职招聘' ? 'all' : 'part' ;
    return (
        <View style={{flex:1}}>
          <NavigationBar title={this.props.title} leftButton={<TouchableOpacity onPress={this._pop.bind(this)}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>}/>
          <View style={{flex:1,backgroundColor:'#f3f3f4'}}>
            {
              this.state.isLoading?
              <View style={{flex:1,justifyContent:'center'}}>
                <ActivityIndicator
                    color="#ee735c"
                    size="large"
                  />
              </View>
              :
               <FilterMenuIndex dataType={dataType} position = {this.props.position} userInfo = {this.props.userInfo}
               navigator={this.props.navigator}  dataList = {this.state.dataList} pageType = {pageType}/>
            }
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  bar_btn:{
    color:'#fff',
    fontSize:18,
    paddingVertical:10,
    paddingHorizontal:5,
    fontWeight:'bold'
  },
})