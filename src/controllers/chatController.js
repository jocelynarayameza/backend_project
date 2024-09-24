
import MessageManager from "../daos/mongodb/chatDao.js";
const messageManager = new MessageManager();

export const chatSocket = (io) => {

    io.on('connection', async (socket) => {
        console.log(`Nueva conexión:${socket.id}`);
        io.emit('messages', await messageManager.getMessages()); 
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado`, socket.id);
        });
        
        socket.on('chatMessage', async (msg) => {
            await messageManager.addMessages(msg);
            io.emit('messages', await messageManager.getMessages()); 
        });

        socket.on('newUser', (user) => {
            socket.broadcast.emit('newUser', user);
        });
    })
}

export const getAll = async (req, res, next) => {
    try {
      res.render("chat");
    } catch (error) {
      res.render("error");
    }
  };

