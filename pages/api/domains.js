export default async function handler(req, res) {
    const { username, apiKey , provider } = req.body;
    if(provider == "Name.com") {
        if (!username || !apiKey) {
            return res.status(400).json({error: 'Missing username or API key'});
        }

        try {
            const response = await fetch('https://api.name.com/v4/domains', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username}:${apiKey}`).toString('base64')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch domains');
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
}
