import React from 'react';
import './MovieList.css';

interface Movie {
    Id: number;
    Name: string;
    PosterUrl: string;
    Rating: number;
}

interface MovieListProps {
    movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
    return (
        <div id="moviesContainer">
            {movies.map((movie) => (
                <div key={movie.Id} className="movie-card">
                    <img src={movie.PosterUrl} alt={movie.Name} />
                    <h3>{movie.Name}</h3>
                    <p>Rating: {movie.Rating}</p>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
