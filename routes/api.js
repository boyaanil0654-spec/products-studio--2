routes/api.js
const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
    res.json({
        success: true,
        stats: {
            assetsGenerated: '2.4M+',
            activeUsers: '15K+',
            avgTimeSaved: '95%',
            brandsOnboarded: '3,200+'
        }
    });
});

router.get('/models', (req, res) => {
    res.json({
        success: true,
        models: [
            { id: 1, name: 'Sophia', gender: 'female', ethnicity: 'Mixed', age: '25-30' },
            { id: 2, name: 'Marcus', gender: 'male', ethnicity: 'African American', age: '28-33' },
            { id: 3, name: 'Elena', gender: 'female', ethnicity: 'Latina', age: '22-27' },
            { id: 4, name: 'James', gender: 'male', ethnicity: 'Caucasian', age: '30-35' },
            { id: 5, name: 'Yuki', gender: 'female', ethnicity: 'East Asian', age: '24-29' },
            { id: 6, name: 'Raj', gender: 'male', ethnicity: 'South Asian', age: '26-31' },
            { id: 7, name: 'Amara', gender: 'female', ethnicity: 'African', age: '23-28' },
            { id: 8, name: 'Liam', gender: 'male', ethnicity: 'European', age: '27-32' }
        ]
    });
});

module.exports = router;
