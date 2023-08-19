const express = require('express');
const axios = require('axios');
const app = express();

const TIMEOUT = 5000; // Timeout in milliseconds

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid URLs' });
    }

    const uniqueNumbers = new Set();

    const fetchData = async (url) => {
        try {
            const response = await axios.get(url, { timeout: TIMEOUT });
            const numbers = response?.data?.numbers;
            if (Array.isArray(numbers)) {
                numbers.forEach(num => uniqueNumbers.add(num));
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
        }
    };

    const fetchPromises = urls.map(fetchData);

    try {
        await Promise.all(fetchPromises);
    } catch (error) {
        console.error('Error processing URLs:', error.message);
    }

    const sortedUniqueNumbers = [...uniqueNumbers].sort((a, b) => a - b);
    res.json({ numbers: sortedUniqueNumbers });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
