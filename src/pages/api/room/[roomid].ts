import { NextApiRequest, NextApiResponse } from 'next'

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  if(process.env.USE_TEST_DATA) {
    console.warn("returning test data... unset 'USE_TEST_DATA' to send real requests.")

    let business = {
      ...TEST_BUSINESS,
      id: query.id
    };

    return res.status(200).json(business)
  }

  console.log("HELLO< QUERY", query)
  if (query.id) {
    const data = await fetch(
      `https://api.yelp.com/v3/businesses/${query.id}`,
      {
        mode: 'no-cors',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`
        }
      }
    ).then(res => {
      console.log(res)
      return res.json()
    })
    if (data.error) {
      return res.status(500).json({ error: 'Server Error' })
    } else {
        console.log("HEHIHIDHISD", data)
        return res.status(200).json(data)
    }
  }
  return res.status(400).json({ error: 'Missing query params' })
}

export default handler
