const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'ShenZhen!6',
    database: 'offshore',
});

app.get('/api/data', (req, res) => {
    const { dro_code } = req.query;
    console.log(`Received request for DRO Code: ${dro_code}`)
    if (!dro_code) {
        return res.status(400).json({ error: 'dro_code is required' });
    }
    const query = `select data_date, acf_share_able from offshore.dro_acf where dro_code = "${dro_code}" order by data_date`;
    console.log(`Executing query: ${query}`)
    db.query(query, [dro_code], (err, results) => {
        if (err) throw err;
        console.log(`Results for DRO Code ${dro_code}:`, results);
        res.json(results);
    });
});

const PORT = process.env.PORT || 443
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});