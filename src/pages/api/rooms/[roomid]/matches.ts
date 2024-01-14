import { NextApiRequest, NextApiResponse } from 'next'
import RoomsProvider from '../../../../api/room/rooms-provider';

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { roomid, time } = req.query
  const rooms = RoomsProvider.getRooms();
  const room = rooms.getRoom(roomid as string);

  if (req.method === 'GET') {
    // gets matches from room
    const matches = room.getMatchesSince(new Date(time as string));
    
    return res.status(200).json(matches);
  } else {
    // no other methods allowed
    return res.status(405).end();
  }
}

export default handler
