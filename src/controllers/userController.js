import * as services from '../services/userServices.js'
import { sendMail } from '../services/mailService.js';
import { json } from 'express';
import nodemailer from 'nodemailer'

export const registerResponse = (req, res) => {
  try {
    res.json({
      msg: 'Register OK',
      session: req.session
    })
  } catch (error) {
    throw new Error(error);
  }
};

export const getUsers = async (req, res) => {
  const users = await services.getUsers()
  res.status(200).send({ status: 'success', users: users })
}

export const loginResponse = async (req, res) => {
  try {
    let id = null;
    if (req.session.passport && req.session.passport.user) id = req.session.passport.user;
    const user = await services.getById(id);
    if (!user) res.status(401).json({ msg: 'Error de autenticacion' });
    req.user.last_connection = Date.now();
    await services.update(req.user._id, req.user);
    const { first_name, last_name, email, role, carts, last_connection } = user;
    res.json({
      msg: 'LOGIN OK!',
      user: {
        first_name,
        last_name,
        email,
        role,
        carts,
        last_connection
      }
    })

  } catch (error) {
    throw new Error(error);
  }
};

export const infoSession = (req, res) => {
  res.json({
    session: req.session,
    sessionId: req.sessionID,
    cookies: req.cookies,
    user: req.user
  })
};

export const logout = (req, res) => {
  req.session.destroy();
  res.send("Session destroyed");
};

export const githubResponse = async (req, res, next) => {
  try {
    const { first_name, last_name, email, role } = req.user;
    res.json({
      msg: 'LOGIN CON GITHUB OK!',
      user: {
        first_name,
        last_name,
        email,
        role
      }
    })
  } catch (error) {
    next(error)
  }
}

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await services.getByEmail(email);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const token = await services.generateResetPass(user);

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Restablecimiento de contraseña",
      html: `<p>¡Hola ${user.first_name}! Hacé click <a href="http://localhost:8080/new-pass/${token}">AQUÍ</a> para restablecer tu contraseña.</p>`,
    };

    await sendMail(mailOptions);

    res.json({ msg: 'Se ha enviado un enlace de restablecimiento de contraseña a tu email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = services.verifyToken(token);
    const user = await services.getById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    await services.updatePass(newPassword, user);

    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const premium = async (req, res) => {
  const { id } = req.params;
  req.logger.info(`Manejando lógica de usuarios premium para el usuario con ID: ${id}`);
  const user = await services.getById(id)

  if (req.user.role === 'admin') {
    switch (user.role) {
      case 'user':
        user.role = 'premium';
        break;
      case 'premium':
        user.role = 'user';
        break;
    }
    const updateUser = await services.update(id, user);
    req.logger.info(`Usuario actualizado a rol: ${user.role}`);
    res.status(200).send({ status: 'success', user: user });
    return;
  }
}

export const deleteUsers = async (req, res) => {
  try {
    const twoDaysAgo = moment().subtract(2, 'days').toDate();
    const usersToDelete = await services.getUsers({ last_connection: { $lt: twoDaysAgo } });

    const transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.PASSWORD_GMAIL,
      }
    });

    for (const user of usersToDelete) {
      // Enviamos correo electrónico
      if (user.email) {
        await transport.sendMail({
          from: `Coder <${process.env.EMAIL}>`,
          to: user.email,
          subject: 'Tu cuenta ha sido eliminada',
          text: `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad.`,
        });
        req.logger.info(`Correo enviado a: ${user.email}`);
      } else {
        req.logger.warning(`No se pudo enviar correo a un usuario debido a que no tiene una dirección de correo electrónico definida.`);
      }
    }

    await services.deleteUsers({ _id: { $in: usersToDelete.map(user => user._id) } });
    req.logger.info(`Usuarios eliminados correctamente.`);
    res.json({ message: 'Usuarios eliminados correctamente' });

  } catch (error) {

    res.status(500).json({ message: 'Hubo un error al eliminar los usuarios' });
  }
}