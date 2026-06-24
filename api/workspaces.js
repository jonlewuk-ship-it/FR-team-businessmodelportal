// A dedicated, independent HTTP storage bucket for the FR TEAM portal
const KV_BUCKET_URL = "https://kvdb.io/K99b6BBN2x58pC6SUpXN9U/acca_fr_workspaces";

// Default pre-seeded markets tailored specifically for the FR division
const defaultMarkets = [
  {
    name: "France", 
    city: "Paris", 
    code: "fr", 
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", // City image 
    url: "https://collaborative-bmc.vercel.app/canvas/8fzr4ud4ikw0pvvn61qutsexk3ckncei", 
    custom: false
  },
  {
    name: "Algérie", 
    city: "Alger", 
    code: "dz", 
    img: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=1200", 
    url: "#", 
    custom: false
  },
  {
    name: "Maroc", 
    city: "Rabat", 
    code: "ma", 
    img: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200", 
    url: "#", 
    custom: false
  },
  {
    name: "Suisse", 
    city: "Berne", 
    code: "ch", 
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200", 
    url: "#", 
    custom: false
  }
];

export default async function handler(request, response) {
  try {
    const { method } = request;

    // --- GET: FETCH FR WORKSPACES ---
    if (method === 'GET') {
      const res = await fetch(KV_BUCKET_URL);
      
      if (res.status === 404) {
        await fetch(KV_BUCKET_URL, {
          method: 'POST',
          body: JSON.stringify(defaultMarkets)
        });
        return response.status(200).json(defaultMarkets);
      }

      const data = await res.json();
      return response.status(200).json(data);
    }

    // --- POST: ADD NEW FR WORKSPACE ---
    if (method === 'POST') {
      const newWorkspace = request.body;
      const getRes = await fetch(KV_BUCKET_URL);
      let currentData = getRes.status === 200 ? await getRes.json() : defaultMarkets;

      currentData.push(newWorkspace);
      
      await fetch(KV_BUCKET_URL, {
        method: 'POST',
        body: JSON.stringify(currentData)
      });
      return response.status(200).json(currentData);
    }

    // --- DELETE: REMOVE FR WORKSPACE ---
    if (method === 'DELETE') {
      const { index } = request.query;
      const getRes = await fetch(KV_BUCKET_URL);
      let currentData = getRes.status === 200 ? await getRes.json() : defaultMarkets;

      if (index !== undefined) {
        currentData.splice(parseInt(index, 10), 1);
        await fetch(KV_BUCKET_URL, {
          method: 'POST',
          body: JSON.stringify(currentData)
        });
      }
      return response.status(200).json(currentData);
    }

    return response.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
