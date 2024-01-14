import { NextApiRequest, NextApiResponse } from 'next'
import RoomsProvider from '../../../../api/room/rooms-provider';

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { roomid } = req.query
  const rooms = RoomsProvider.getRooms();
  const room = rooms.getRoom(roomid as string);

  if (req.method === 'POST') {
    // reset implementation
    (global as any).roomsInstance = null;

    return res.status(200).end();
  } else {
    // no other methods allowed
    return res.status(405).end();
  }
}

export default handler
