const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3007;

// Middleware
app.use(cors({ origin: 'http://act-survey-app.s3-website-us-east-1.amazonaws.com/' }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TILE2244%',
    database: 'survey_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Endpoint to fetch ENUM values for type
app.get('/api/type-enum-values/survey_questions/Type', (req, res) => {
    const query = "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'survey_questions' AND COLUMN_NAME = 'Type'";
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching ENUM values:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const values = result[0].COLUMN_TYPE.match(/enum\((.*)\)/)[1].replace(/'/g, "").split(",");
        res.json(values);
    });
});

// Endpoint to fetch ENUM values for rating type
app.get('/api/ratingtype-enum-values/survey_questions/Rating_Type', (req, res) => {
    const query = "SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'survey_questions' AND COLUMN_NAME = 'Rating_Type'";
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching ENUM values:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const values = result[0].COLUMN_TYPE.match(/enum\((.*)\)/)[1].replace(/'/g, "").split(",");
        res.json(values);
    });
});

// Endpoint to save survey data
app.post('/create', (req, res) => {
    const { surveyname, surveydescription, surveydescriptionattheend, surveydesthankyoumessage, children } = req.body;

    const surveyQuery = `
        INSERT INTO surveys (name, description, description_at_end, thank_you_message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        surveyQuery,
        [surveyname, surveydescription, surveydescriptionattheend, surveydesthankyoumessage],
        (err, surveyResult) => {
            if (err) {
                console.error('Error inserting survey:', err);
                res.status(500).send({ message: 'Error saving survey.' });
                return;
            }

            const surveyId = surveyResult.insertId;
            const questionQueries = children.map(child => {
            const questionQuery = `
                INSERT INTO survey_questions (parent_id, Question_Name, Type, Minimum, Maximum, Min_Value_Word, Max_Value_Word, Choices, Pick_Values_with_Additional_Comments, Collect_Comments, isrequired, Rating_Type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const questionValues = [
                surveyId ?? null, 
                child.questionname || null, 
                child.type || null, 
                child.minvalue !== undefined && child.minvalue !== '' ? child.minvalue : null,
                child.maxvalue !== undefined && child.maxvalue !== '' ? child.maxvalue : null,
                child.minword || null, 
                child.maxword || null, 
                child.choices || null, 
                child.pickvalues || null, 
                child.collectcomments ? 1 : 0,
                child.isrequired  ? 1 : 0,
                child.ratingtype || null,
            ];
            return new Promise((resolve, reject) => {
                db.query(questionQuery, questionValues, (error, result) => {
                if (error) return reject(error);
                resolve(result);
                });
            });
            });
        
            Promise.all(questionQueries)
            .then(() => {
                res.send({ message: 'Survey created successfully' });
            })
            .catch(error => {
                console.error('Error inserting survey questions:', error);
                res.status(500).send({ message: 'Failed to create survey questions' });
            });
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
