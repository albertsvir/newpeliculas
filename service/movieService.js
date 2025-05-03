const express = require('express');
const router = express.Router();
const Movie = require('../Movie'); // Modelo de película

class MovieService {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/peliculas', this.getAllMovies);
        this.router.get('/peliculas/:id', this.getMovieById);
        this.router.post('/peliculas', this.addMovie);
        this.router.put('/peliculas/:id', this.updateMovie);
        this.router.delete('/peliculas/:id', this.deleteMovie);
    }
    getRouter() {
        return this.router;
    }

  getAllMovies = async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            console.error('Error al obtener las películas:', error);
            res.status(500).send('Error al obtener las películas');
        }
    }

    getMovieById = async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).send('Película no encontrada');
            }
            res.json(movie);
        } catch (error) {
            console.error('Error al obtener la película:', error);
            res.status(500).send('Error al obtener la película');
        }
    }

    addMovie = async (req, res) => {
        try {
            const newMovie = new Movie(req.body);
            await newMovie.save();
            res.status(201).json(newMovie);
        } catch (error) {
            console.error('Error al agregar la película:', error);
            res.status(400).send('Error al agregar la película');
        }
    }

    updateMovie = async (req, res) => {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedMovie) {
                return res.status(404).send('Película no encontrada');
            }       
            res.json(updatedMovie);
        }
        catch (error) {
            console.error('Error al actualizar la película:', error);
            res.status(400).send('Error al actualizar la película');
        }
    }   

    deleteMovie = async (req, res) => {
        try {
            const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
            if (!deletedMovie) {
                return res.status(404).send('Película no encontrada');
            }
            res.json({ message: 'Película eliminada' });
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            res.status(500).send('Error al eliminar la película');
        }
    }   
}
