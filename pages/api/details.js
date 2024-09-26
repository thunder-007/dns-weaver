// pages/api/details.js

export default async function handler(req, res) {
    const { username, apiKey , provider , domainName } = req.body;
    if (!domainName) {
        return res.status(400).json({ error: "Domain name is required" });
    }
    if (provider == "Name.com") {
        try {
            const response = await fetch(`https://api.name.com/v4/domains/${domainName}/records`, {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username}:${apiKey}`).toString('base64')}`,
                    "Content-Type": "application/json",
                },

            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return res.status(200).json(data); // Return the API response
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
    }
}
