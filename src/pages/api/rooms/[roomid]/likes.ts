import { NextApiRequest, NextApiResponse } from 'next'
import RoomsProvider from '../../../../api/room/rooms-provider';

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { roomid } = req.query
  const { businessid } = req.body
  const rooms = RoomsProvider.getRooms();
  const room = rooms.getRoom(roomid as string);

  if (req.method === 'POST') {
    room.addLike(businessid);

    console.log(`added business ${businessid} as like to room ${roomid}`);

    return res.status(200);
  } else {
    // no other methods allowed
    return res.status(405).end();
  }
}

export default handler
