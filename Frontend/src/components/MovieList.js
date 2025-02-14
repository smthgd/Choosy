import React from 'react';

const MovieList = ({ movies }) => {
    return (
        <div id="moviesContainer">
            {movies.map((movie) => (
                <div key={movie.Id} className="movie-card">
                    <img src={movie.PosterUrl} alt={movie.Name} />
                    <h3>{movie.Name}</h3>
                    <p>Rating: {movie.Rating}</p>
                </div>
            ))}
            <style jsx>{`
                .movie-card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    margin: 10px;
                    padding: 10px;
                    display: inline-block;
                    width: 150px; /* Ширина карточки */
                    text-align: center;
                }
                .movie-card img {
                    max-width: 100%; /* Ограничение ширины изображения */
                    height: auto; /* Автоматическая высота */
                }
            `}</style>
        </div>
    );
};

export default MovieList;
