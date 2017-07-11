import React, {Component} from 'react';
import {
	ScrollView,
	Text,
	StyleSheet,
	View
} from 'react-native';
import MoviePoster from './MoviePoster';
import MoviePopup from './MoviePopup';
import {movies} from './data';

export default class Movies extends Component{

	state={
		popupIsOpen: false,

		//Chosen time
		chosenTime: 0,
		//Chosen day.
		chosenDay: null,
	}

	openMovie = (movie) => {
		this.setState({
			popupIsOpen: true,
			movie,
		});
	}

	closeMovie = () => {
		this.setState({
			popupIsOpen: false,
			chosenTime: 0,
			chosenDay: null,
		});
	}

	chooseTime = (time) => {
		this.setState({
			chosenTime: time,
		});
	}

	bookMyTicket = () => {
		if(!this.state.chosenTime)
		{
			alert('Please select show time.');
		} else{
			this.closeMovie();
			this.props.navigator.push({
				name: 'confirmation',
				code: Math.random().toString(36).substring(6).toUpperCase(),
			});
		}
	}

	chooseDay = (day) => {
		this.setState({
			chosenDay: day,
		});
	}

	render(){
		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent}
							showHorizontalScrollIndicator={false}
							showVerticalScrollIndicator={false}>
					{movies.map((movie, index) => <MoviePoster
														movie = {movie}
														onOpen = {this.openMovie}
														key = {index}
													/>)}
				</ScrollView>
				<MoviePopup
							movie={this.state.movie}
							isOpen = {this.state.popupIsOpen}
							onClose={this.closeMovie}
							chosenDay={this.state.chosenDay}
							chosenTime={this.state.chosenTime}
							onChooseDay={this.chooseDay}
							onChooseTime={this.chooseTime}
							onBook={this.bookMyTicket}
				/>
			</View>
			);
	}
}

const styles = StyleSheet.create({

	container:{
		paddingTop:20
	},
	scrollContent:{
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
});