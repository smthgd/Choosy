import React from 'react';
import './MovieList.css';

interface Movie {
    id: number;
    name: string;
    posterUrl: string;
    rating: number;
}

interface MovieListProps {
    movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    console.log(movies);
    return (
        <div id="moviesContainer">
            {movies.map((movie) => {
                   return (
                    <div key={movie.id} className="movie-card">
                   <img src={movie.posterUrl} alt={movie.name} />
                   <h3>{movie.name}</h3>
                   <p>Rating: {movie.rating}</p>
               </div>)

            })}
        </div>
    );
};

export default MovieList;
