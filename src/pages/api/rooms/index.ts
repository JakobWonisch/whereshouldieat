import { NextApiRequest, NextApiResponse } from 'next'
import RoomsProvider from '../../../api/room/rooms-provider'

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const rooms = RoomsProvider.getRooms();
  
  if (req.method === 'GET') {
    // generate new room for user
    return res.status(200).json({
      roomid: rooms.generateRoomId()
    });
  } else {
    // no other methods allowed
    return res.status(405).end();
  }
}

export default handler
