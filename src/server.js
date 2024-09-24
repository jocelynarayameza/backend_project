import express from "express";
import { __dirname } from './utils.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import 'dotenv/config'
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import userRouter from "./routes/userRouter.js";
import mockRouter from "./routes/mockRouter.js"
import mailRouter from "./routes/mailRouter.js"
import test from "./routes/testRoutes.js";
import morgan from "morgan";
import cors from 'cors'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { connectMongoDB } from "./daos/mongodb/connection.js";
import { chatSocket } from "./controllers/chatController.js";
import MongoStore from "connect-mongo";
import { addLogger, logger } from "./config/customLogger.js";
import passport from "passport";
import './passport/local-passport.js'
import './passport/passport-github.js'
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from "swagger-jsdoc";
import {info} from "./docs/info.js"

const storeConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.SECRET_KEY },
        ttl: 180,
    }),
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 180000 }
};

const specs = swaggerJSDoc(info);

const app = express();

app.use(cors ({origin: process.env.URL_FRONT_REACT, credentials: true}))
app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(storeConfig));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());
app.use(addLogger);


//PARA USAR HANDLEBARS, ESTAS TRES LÍNEAS
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use("/api/productos", productRouter);
app.use("/api/cart", cartRouter)
app.use('/', viewsRouter);
app.use('/users', userRouter)
app.use('/mockingproducts', mockRouter);
app.use('/loggerTest', test);
app.use('/mail', mailRouter)



connectMongoDB();

const httpServer = app.listen(8080, ()=>{
    logger.info(' Server listening on port 8080');
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        logger.info('Usuario desconectado');
    })    
})
chatSocket(io);

export function getSocket(){
    return io;
}



