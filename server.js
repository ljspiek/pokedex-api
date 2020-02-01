require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const POKEDEX = require('./pokedex.json');

// console.log(process.env.API_TOKEN)

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

// app.use((req, res) => {
//     res.send('Hello, world!!')
// });

const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']

app.use(function validateBearerToken(req, res, next) {
    console.log('validate bearer token middleware')
    // const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    // if(bearerToken !== apiToken) {
    //     return res.status(401).json({error: 'Unauthorized request'})
    // }

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unathorized request'})
    }

    next()
})

function handleGetTypes(req, res) {
    res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    if(req.query.name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase()))
    }

    if(req.query.type) {
        response = response.filter(pokemon =>
            pokemon.type.includes(req.query.type))
    }

    res.json(response)
}

app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
