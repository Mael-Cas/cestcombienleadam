const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const getMainHtml = require('./getMainHtml');
const getAdminhtml = require('./getAdminhtml');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser les corps de requête JSON
app.use(bodyParser.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/votre_base_de_donnees', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Erreur de connexion MongoDB:', err));

const DataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    value: Number
});

const Data = mongoose.model('Data', DataSchema);

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public', 'adam_head.ico')));

app.get('/graph-data', async (req, res) => {
    try {
        const data = await Data.find({});
        res.json(data);
    } catch (error) {
        console.error('Erreur serveur lors de la récupération des données:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.post('/add-data', async (req, res) => {
    const { timestamp, value } = req.body;
    try {
        const newData = new Data({ timestamp, value });
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        console.error('Erreur serveur lors de l\'ajout de données:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
        const updatedData = await Data.findByIdAndUpdate(id, { value }, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.error('Erreur serveur lors de la modification de données:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.delete('/delete-data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Data.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur serveur lors de la suppression de données:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/', async (req, res) => {
    try {
        const content = await getMainHtml();
        res.send(content);
    } catch (error) {
        console.error('Erreur serveur lors de la récupération du fichier HTML principal:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/admin', async (req, res) => {
    try {
        const content = await getAdminhtml();
        res.send(content);
    } catch (error) {
        console.error('Erreur serveur lors de la récupération du fichier HTML admin:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
});
