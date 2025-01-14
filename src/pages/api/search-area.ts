import { NextApiRequest, NextApiResponse } from 'next'
import { TEST_DATA } from '../../../ignore/test-data'

async function handler (req: NextApiRequest, res: NextApiResponse) {

  if(process.env.USE_TEST_DATA) {
    console.warn("returning test data... unset 'USE_TEST_DATA' to send real requests.")

    return res.status(200).json(TEST_DATA)
  }

  const { query } = req
  if (query.l && query.q) {
    const data = await fetch(
      `https://api.yelp.com/v3/businesses/search?term=${query.q}&location=${query.l}`,
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
    }
    return res.status(200).json(data)
  }
  return res.status(400).json({ error: 'Missing query params' })
}

export default handler
