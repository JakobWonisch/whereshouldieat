import { NextApiRequest, NextApiResponse } from 'next'
import RoomsProvider from '../../../../api/room/rooms-provider';

async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { roomid } = req.query
  const rooms = RoomsProvider.getRooms();
  const room = rooms.getRoom(roomid as string);

  if (req.method === 'POST') {
    // adds user to room
    const user = room.addUser();

    console.log(`added user ${user.id} to room ${roomid}`);

    return res.status(200).json(user);
  } else {
    // no other methods allowed
    return res.status(405).end();
  }
}

export default handler
