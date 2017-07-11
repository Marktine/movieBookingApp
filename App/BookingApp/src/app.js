import React, {Component} from 'react';
import Styles from './styles';
import {
	Navigator,
} from 'react-native-deprecated-custom-components';
import Confirmation from './Confirmation';
import Movies from './Movies';

const routeMapper = (route, navigator) => {
	if(route.name === 'movies')
	{
		return (<Movies navigator={navigator} />);
	}
	else if (route.name === 'confirmation')
	{
		return (
				<Confirmation code={route.code} navigator={navigator} />
			);
	}
};

export default class App extends Component{
	render(){
		return (
			<Navigator
				initialRoute={{name: 'movies'}}
				configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
				renderScene= {routeMapper} 
			/>
			);
	}
}