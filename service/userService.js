const express = require('express');
const router = express.Router();
const Movie = require('../Movie'); // Modelo de película
const UserMovie = require('../UserMovie'); // Modelo de película de usuario
const User = require('../User'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Para encriptar contraseñas

class UserService {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    getAllUserMovies = async (req, res) => {
        try {
            const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la ruta
            const userMovies = await UserMovie.find({ userId }).populate('movieId'); // Obtener las películas del usuario
            res.json(userMovies);
        } catch (error) {
            console.error('Error al obtener las películas del usuario:', error);
            res.status(500).send('Error al obtener las películas del usuario');
        }

    }

    getUserById = async (req, res) => {
        try {
            const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la ruta
            const user = await User.findById(userId); // Obtener el usuario por ID
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.json(user);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).send('Error al obtener el usuario');
        }
    }

    //metodo para permitir que el admin te de la autorizacion para eliminar peliculas
    deleteUserMovie = async (req, res) => {
        try {
            const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la ruta
            const movieId = req.params.movieId; // Obtener el ID de la película de los parámetros de la ruta
            const deletedUserMovie = await UserMovie.findOneAndDelete({ userId, movieId }); // Eliminar la película del usuario
            if (!deletedUserMovie) {
                return res.status(404).send('Película no encontrada para el usuario');
            }
            res.json(deletedUserMovie);
        } catch (error) {
            console.error('Error al eliminar la película del usuario:', error);
            res.status(500).send('Error al eliminar la película del usuario');
        }
    }

    
}