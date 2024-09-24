import * as ticketService from "../services/ticketService.js"

export const ticketController = async (req, res) => {

    try {
      const user = req.user;
      const ticket = await ticketService.createTicketService(user);
       res.status(200).json(ticket);
    } catch (error) {
        console.error('Error en el controlador:', error);
      res.status(500).json({ msg: "Error en controller" });
    }
  }
