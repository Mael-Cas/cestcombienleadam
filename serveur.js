const express = require('express');
const app = express();
const port = 3000;

// Configuration de MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/graphDB');

const getMain = require("./getMainHtml");
const getAdmin = require("./getAdminhtml");

// Définition du schéma MongoDB
const graphSchema = new mongoose.Schema({
    timestamp: String,
    value: Number
});
const GraphData = mongoose.model('GraphData', graphSchema);

// Middleware pour analyser les corps de requête JSON
app.use(express.json());


app.get("/", async (req, res) => {
    const mian = await getMain();
    res.send(mian);
})
// Route pour récupérer les données du graphique
app.get('/graph-data', async (req, res) => {
    try {
        const data = await GraphData.find();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour l'interface d'administration
app.get('/admin', async (req, res) => {
    const admin = await getAdmin();
    res.send(admin);
});

// Route pour ajouter des données au graphique
app.post('/add-data', async (req, res) => {
    try {
        const { timestamp, value } = req.body;
        console.log(value);
        const newData = new GraphData({
            timestamp: timestamp,
            value: value
        });
        await newData.save();
        res.status(201).send('Données ajoutées avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur lors de l\'ajout des données');
    }
});

app.delete('/delete-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await GraphData.findByIdAndDelete(id);
        res.status(200).send('Données supprimées avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur lors de la suppression des données');
    }
});



app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port http://localhost:${port}`);
});