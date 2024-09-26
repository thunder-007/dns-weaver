// pages/api/addrecord.js

export default async function handler(req, res) {
    console.log("calling");
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, apiKey, domainName, host, type, answer, ttl } = req.body;
    console.log(username,apiKey,domainName,'d',host,type,answer,ttl);
    // if (!domainName || !host || !type || !answer || !ttl) {
    //     return res.status(400).json({ error: 'All fields are required' });
    // }
    console.log("calling again")

    try {
        const response = await fetch(`https://api.name.com/v4/domains/${domainName}/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${username}:${apiKey}`).toString('base64')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                host,
                type,
                answer,
                ttl
            })
        });
        console.log(response);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return res.status(200).json(data); // Return the API response
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
