import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import db from '../config'
import { ScrollView } from 'react-native-gesture-handler';

export default class SearchScreen extends React.Component{
constructor(props){
    super(props);
    this.state={
        allTransactions:[],
        lastVisibleTransaction:null,
        search:''

    }
}
componentDidMount =async()=>{
const query = await db.collection("transaction").get();
//console.log("query is "+query.docs)
query.docs.map((doc)=>{
    this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastVisibleTransaction:doc
    })
    console.log("query details "+doc.data())
})
}

/* fetchMoreTxn = async ()=>{
    const query = await db.collection("transaction").startAfter(this.state.lastVisibleTransaction).limit(10).get();
    query.docs.map((doc)=>{
        this.setState({
            allTransactions:[...this.state.allTransactions,doc.data()],
            lastVisibleTransaction:doc
        })
        console.log("query details "+doc.data())
    })
} */

fetchMoreTransactions = async ()=>{
    var text = this.state.search.toUpperCase()
    var enteredText = text.split("")

    
    if (enteredText[0].toUpperCase() ==='B'){
    const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc
      })
    })
  }
    else if(enteredText[0].toUpperCase() === 'S'){
      const query = await db.collection("transactions").where('bookId','==',text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
}

searchTransactions= async(text) =>{
    var enteredText = text.split("")  
    if (enteredText[0].toUpperCase() ==='B'){
      const transaction =  await db.collection("transactions").where('bookId','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
    else if(enteredText[0].toUpperCase() === 'S'){
      const transaction = await db.collection('transactions').where('studentId','==',text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions,doc.data()],
          lastVisibleTransaction: doc
        })
      })
    }
  }

render(){
    return(
        /*<ScrollView>
            <Text>Before scroll</Text>

            
            {this.state.allTransactions.map((transaction,index)=>{
                return(
            <View key = {index} style ={{borderBottomWidth:2}}>
                <Text>{"Book Id: "+transaction.bookId}</Text>
                <Text>{"Student Id: "+transaction.studentId}</Text>
                <Text>{"Txn type: "+transaction.transactionType}</Text>
                <Text>{"Date: "+transaction.data.toDate()}</Text>
            </View>
                )
            })}
            

        </ScrollView>
        */
 <View style={styles.container}>
        <View> style={styles.searchBar}
            <TextInput style={styles.bar} placeholder="Enter the book or student ID"
            onChangeText={(text)=>{
                this.setState({
                    search:text
                })
            }}></TextInput>
            <TouchableOpacity style = {styles.searchButton} onPress = {()=>{this.searchTxn(this.state.search)}}> 
            <Text>SEARCH</Text>
            </TouchableOpacity>
        </View>
       
       <FlatList 
       data = {this.state.allTransactions}
       renderItem={({item})=>{
        <View style ={{borderBottomWidth:2}}>
        <Text>{"Book Id: "+transaction.bookId}</Text>
        <Text>{"Student Id: "+transaction.studentId}</Text>
        <Text>{"Txn type: "+transaction.transactionType}</Text>
        <Text>{"Date: "+transaction.data.toDate()}</Text>
        </View>
       }}
       keyExtractor = {(item,index)=>index.toString()}
       onEndReached={this.fetchMoreTxn}
       onEndReachedThreshold={0.7}
       />
       </View>
    );
}

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })
