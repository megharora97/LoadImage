import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, SafeAreaView, View } from 'react-native';
import { Text, Icon, } from 'react-native-elements'
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { GetimageData } from '../Services/Api';
import AsyncStorage from '@react-native-community/async-storage';
import { ImageApi } from '../Utils/Config';

const { height, width } = Dimensions.get('window');

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userId: "108",
            offset: 0,
            type: "popular",
            Images: []
        }
    }

    componentDidMount() {
        this.getImages()
    }


    async getImages() {
        const { userId, offset, type, Images } = this.state
        this.setState({ loading: true })

        let formData = new FormData();
        formData.append("user_id", userId);
        formData.append("offset", offset);
        formData.append("type", type);

        await GetimageData(ImageApi, formData)
            .then((res) => {
                this.setState({ loading: false })
                console.log("getImages res", res);
                if (res.status === 'success') {
                    let Response = res.images
                    console.log("Response", Response);
                    AsyncStorage.setItem('Response', JSON.stringify(Response))
                    if (Response && Response != '') {
                        Response.map((item, index) => {
                            Images.push({ ...item })
                        })
                    }
                    console.log("Images", Images);
                    this.setState({ Images: Images })

                }
                else {
                    console.log(res.images);
                }
            })

            .catch((error) => {
                this.setState({ loading: false })
                console.log('GetimageData Eroor', error);
                console.log(error)
            })
    }

    GotoDetailsScreen(item) {
        console.log("GotoDetailsScreenitem", item);
        this.props.navigation.navigate('Details', { image: item.xt_image })
    }

    renderItem1 = ({ item, index }) => {
        return (
            < View  >
                <TouchableOpacity
                    onPress={() => this.GotoDetailsScreen(item)}
                >
                    <Image
                        source={{ uri: item.xt_image }}
                        style={{ height:width, width: width }}
                        placeholderStyle={{ backgroundColor: 'red' }}
                        resizeMode='contain'
                        resizeMethod='resize'
                    />
                </TouchableOpacity>
            </View >
        )
    }

    async loadmore() {
        const { offset } = this.state
        await this.setState({ offset: offset + 1, })
        this.getImages()
    }


    render() {
        const { Images } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }} >
                <View>
                    <ScrollView>
                        {Images && Images != '' && Images.length > 0 ?
                            <FlatList
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={Images}
                                extraData={this.state}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={Images ? this.renderItem1 : null}
                            />
                            : null}


                        <View style={{ margin: height / 80 }}>
                            <Icon
                                name='dots-three-vertical'
                                type='entypo'
                                color='black'
                                size={height / 35}
                                onPress={() => this.loadmore()} />
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView >

        );
    }
}