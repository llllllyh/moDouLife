import React, {Component} from 'react'
import {SectionList, Text, View, StyleSheet, Platform,TouchableOpacity,Alert} from 'react-native'
import CityList from './CityList'
import NavigationBar from '../../common/NavigationBar';
const ITEM_HEIGHT = 50; //item的高度
const HEADER_HEIGHT = 24;  //分组头部的高度
const SEPARATOR_HEIGHT = 0;  //分割线的高度

export  default  class CityPage extends Component {

    async getCityInfos() {
        let data = await require('../../../res/json/city.json');
        let jsonData = data.data
        //每组的开头在列表中的位置
        let totalSize = 0;
        //SectionList的数据源
        let cityInfos = [];
        //分组头的数据源
        let citySection = [];
        //分组头在列表中的位置
        let citySectionSize = [];
        for (let i = 0; i < jsonData.length; i++) {
            citySectionSize[i] = totalSize;
            //给右侧的滚动条进行使用的
            citySection[i] = jsonData[i].title;
            let section = {}
            section.key = jsonData[i].title;
            section.data = jsonData[i].city;
            for (let j = 0; j < section.data.length; j++) {
                section.data[j].key = j
            }
            cityInfos[i] = section;
            //每一项的header的index
            totalSize += section.data.length + 1
        }
        this.setState({data: cityInfos, sections: citySection, sectionSize: citySectionSize})
    }


    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sections: [],
            sectionSize: []
        }
        this.getCityInfos()
    }

    _choiceCity(city,provcn){
        if(this.props.pageType === 'address'){
            let area = city+provcn;
           Alert.alert(
                '提示',
                '是否将地区修改为'+area,
                [
                    {
                        text:'是',onPress:()=>{
                            this.props.callback(area);
                            this.props.navigator.pop();
                        }
                    },
                    {
                        text:'否'
                    }
                ]
            )
        }else{
            Alert.alert(
                '提示',
                '目前只开放广州市内，感谢支持！',
                [
                    {
                        text:'确定'
                    }
                ]
            )
        }
        
    }

    _pop(){
        this.props.navigator.pop();
    }

    render() {
        if (this.state.data.length > 0) {
            return (
                <View style={{flex:1,backgroundColor:'#fff'}}>
                     <NavigationBar leftButton={<TouchableOpacity onPress={()=>this._pop()}><Text style={styles.bar_btn}>返回</Text></TouchableOpacity>} title='城市选择'/>
                    <View>
                        <SectionList
                            ref='list'
                            enableEmptySections
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                            sections={this.state.data}
                            getItemLayout={this._getItemLayout}/>
                    
                        <CityList
                            sections={ this.state.sections}
                            onSectionSelect={this._onSectionselect}/>
                    </View>
                </View>
            )
        } else {
            return <View/>
        }
    }

    //这边返回的是A,0这样的数据
    _onSectionselect = (section, index) => {
        //跳转到某一项
        this.refs.list.scrollToIndex({animated: true, index: this.state.sectionSize[index]})
    }

    _getItemLayout(data, index) {
        let [length, separator, header] = [ITEM_HEIGHT, SEPARATOR_HEIGHT, HEADER_HEIGHT];
        return {length, offset: (length + separator) * index + header, index};
    }

    _renderItem = (item) => {
        return (
            <TouchableOpacity onPress={()=>this._choiceCity(item.item.provcn,item.item.city_parent)} style={styles.itemView}>
                <Text style={{marginLeft: 30, fontSize: 16, color: '#333'}}>
                    {item.item.city_child}
                </Text>
                <Text style={{marginLeft: 25, fontSize: 15, color: '#999'}}>
                    {item.item.city_parent}
                </Text>
                <Text style={{marginLeft: 25, fontSize: 13, color: '#999'}}>
                    {item.item.provcn}
                </Text>
            </TouchableOpacity>
        )
    }

    _renderSectionHeader = (section) => {
        return (
            <View style={styles.headerView}>
                <Text style={styles.headerText}>{section.section.key}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    headerView: {
        justifyContent: 'center',
        height: HEADER_HEIGHT,
        paddingLeft: 20,
        backgroundColor: '#eee'
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#3cb775'
    },
    itemView: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        height: ITEM_HEIGHT
    },
    bar_btn:{
        color:'#fff',
        fontSize:15,
        paddingLeft:5,
        paddingRight:5,
        fontWeight:'bold'
    },
});