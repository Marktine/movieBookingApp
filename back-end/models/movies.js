import mongoose, {Schema} from 'mongoose';

//Define movies schema
var movieSchema = new Schema({
	title:{
		type: String,
		unique: true,
	},
	poster: String,
	genre: String,
	days: Array,
	times: Array,
});

export default mongoose.model('movies', movieSchema)