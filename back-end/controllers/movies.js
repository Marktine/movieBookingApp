import Movie from '../models/movies';
import moment from 'moment';

const days = ['Today', 'Tomorrow', moment().add(2, 'days').format('ddd, MMM D')];

const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];

export const index = (req, res, next) => {
	Movie.find().lean().exec((err, movies) => {
	if(err)
	{
		console.log(err);
	}
	else
	{
		res.json({
			movies: movies.map(
				movie => ({
				...movie,
					days,
					times,
			}))}
		);
	}
	});
};