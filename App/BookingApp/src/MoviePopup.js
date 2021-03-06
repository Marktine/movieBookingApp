import React, {Component, PropTypes} from 'react';
import {
	Animated,
	Dimensions,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
	Image,
	LayoutAnimation,
	PanResponder,
	TouchableHighlight,
} from 'react-native';

import {defaultStyles} from './styles';
import Options from './Options';
const {width, height} = Dimensions.get('window');

const defaultHeight = height * 0.67;

export default class MoviePopup extends Component{

	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		movie: PropTypes.object,
		chosenDay: PropTypes.number,
		chosenTime: PropTypes.number,
		onChooseDay: PropTypes.func,
		onChooseTime: PropTypes.func,
		onBook: PropTypes.func,
		onClose: PropTypes.func,
	} 

	state={
		position: new Animated.Value(this.props.isOpen ? 0 : height),
		opacity: new Animated.Value(0),
		height: defaultHeight,
		expanded: false,
		visible: this.props.isOpen
	};

	//Stored the previous height before user pulling the popup height to calculate the height of popup component after pulling.
	_previousHeight = 0;

	componentWillMount() {
		this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				const {dx, dy} = gestureState;
				if(!dx == 0 && dy === 0)
				{
					return true;
				}
				return false;
			},
			onPanResponderGrant: (evt, gestureState) => {
				this._previousHeight = this.state.height;
			},

			onPanResponderMove: (evt, gestureState) => {
				const {dy, vy} = gestureState;
				let newHeight = this._previousHeight - dy;
				LayoutAnimation.easeInEaseOut();

				if(newHeight > height - height / 5)
				{
					this.setState({
						expanded: true,
					});
				}else{
					this.setState({expanded: false});
				}

				if(vy < -0.75)
				{
					this.setState({
						expanded: true,
						height: height,
					});
				}

				else if (vy > 0.75)
				{
					this.props.onClose();
				}

				else if (newHeight < defaultHeight * 0.75)
				{
					this.props.onClose();
				}

				else if (newHeight > height)
				{
					this.setState({height: height});
				}
				else
				{
					this.setState({height: newHeight});
				}
			},

			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				const {dy} = gestureState;
				const newHeight = this._previousHeight - dy;
				if(newHeight < defaultHeight)
				{
					this.props.onClose();
				}
				this._previousHeight = this.state.height;
			},

			onShouldBlockNativeResponder: (evt, gestureState) => {
				return true;
			},
		});
	}

	componentWillReceiveProps(nextProps) {
		//isOpen property changed from false to true.
		if(!this.props.isOpen && nextProps.isOpen){
			this.animateOpen();
		}

		//isOpen property changed from true to false.
		else if (this.props.isOpen && !nextProps.isOpen){
			this.animateClose();
		}
	}

	animateOpen(){
		this.setState({visible: true}, () => {
			Animated.parallel([
					Animated.timing(this.state.opacity, {toValue: 0.5}),
					//Slide up
					Animated.timing(
							this.state.position,
							{toValue: 0}
						),
				]).start();
		});
	}

	animateClose(){

		Animated.parallel([

			Animated.timing(
					this.state.opacity,
					{toValue: 0}
				),
			Animated.timing(
					this.state.position,
					{toValue: height}
				),

			]).start(() => this.setState({
				height: defaultHeight,
				expanded: false,
				visible: false,
			}));
	}

	getStyles = () => {
		return {
			imageContainer: this.state.expanded ? {
				width: width/2,
			} : {
				maxWidth: 110,
				marginRight: 10,
			},
			movieContainer: this.state.expanded ? {
				flexDirection: 'column',
				alignItems: 'center'
			} : {
				flexDirection: 'row'
			},
			movieInfo: this.state.expanded ? {
				flex: 0,
				alignItems: 'center',
				paddingTop: 20,
			} : {
				flex: 1,
				justifyContent: 'center',
			},
			title: this.state.expanded ? {
				textAlign: 'center',
			} : {},
		};
	}

	render(){

		const {
			movie,
			chosenDay,
			chosenTime,
			onChooseDay,
			onChooseTime,
			onBook,
		} = this.props;
		const {title, genre, poster, days, times} = movie || {};
		if(!this.state.visible)
			return null;
		return (
				<View style={styles.container}>
					<TouchableWithoutFeedback onPress={this.props.onClose}>
						<Animated.View style={[styles.backdrop, {opacity: this.state.opacity}]}/>
					</TouchableWithoutFeedback>

					<Animated.View
						style={[styles.modal, {
							height: this.state.height,
							transform: [{translateY: this.state.position}, {translateX: 0}]
						}]}
					>	
					<View style={styles.content}>

						{/*Movie poster, title, genre*/}
						<View
							style={[styles.movieContainer, this.getStyles().movieContainer]}
							{...this._panResponder.panHandlers}
							>
							<View style={[styles.imageContainer, this.getStyles().imageContainer]}>
									<Image source={{uri: poster}} style={styles.image} />
							</View>
							{/*title and genre*/}
							<View style={[styles.movieInfo, this.getStyles().movieInfo]}>
								<Text style={[styles.title, this.getStyles().title]}>{title}</Text>
								<Text style={styles.genre}>{genre}</Text>
							</View>
						</View>
						{/*Show times*/}
						<View>
							{/*Days*/}
							<Text style={styles.sectionHeader}>Day</Text>
							{/*Todo: add day options.*/}
							<Options 
								values={days}
								chosen={chosenDay}
								onChoose={onChooseDay}
								/>
							<Text style={styles.sectionHeader}>Time</Text>
							<Options
								values={times}
								chosen={chosenTime}
								onChoose={onChooseTime}
								/>
						</View>	
					</View>
					{/*footer*/}
					<View style={styles.footer}>
						<TouchableHighlight
							underlayColor="#9575CD"
							style={styles.buttonContainer}
							onPress={onBook}>
							<Text style={styles.button}>Book my tickets</Text>
						</TouchableHighlight>
					</View>
					</Animated.View>
				</View>
			);
	}
}
const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
		backgroundColor: 'transparent',
	},

	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'black',
	},

	modal: {
		backgroundColor: 'white',
	},
	content: {
		flex: 1,
		margin: 20,
		marginBottom: 0,
	},
	movieContainer: {
		flex: 1,
		marginBottom: 20,
	},
	imageContainer: {
		flex: 1,
	},

	image: {
		borderRadius: 10,
		...StyleSheet.absoluteFillObject,
	},
	movieInfo: {
		backgroundColor: 'transparent',
	},

	title: {
		...defaultStyles.text,
		fontSize: 20,
	},

	genre: {
		...defaultStyles.text,
		color: '#BBBBBB',
		fontSize: 14,
	},
	sectionHeader: {
		...defaultStyles.text,
		color: '#AAAAAA',
	},
	footer: {
		padding: 20,
	},
	buttonContainer: {
		backgroundColor: '#673AB7',
		borderRadius: 100,
		paddingVertical: 10,
		paddingHorizontal: 5,
		alignItems: 'center',
	},

	button: {
		...defaultStyles.text,
		color: '#FFFFFF',
		fontSize: 18,
	},
});
