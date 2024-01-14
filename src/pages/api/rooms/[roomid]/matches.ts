import { NextApiRequest, NextApiResponse } from 'next'

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { query } = req

  if (req.method === 'GET') {
    // adds likes to room
  } else {
    // no other methods allowed
  }
}

export default handler
