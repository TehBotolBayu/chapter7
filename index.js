require('dotenv').config()
const express = require('express'),
    cors = require('cors')
    app = express(),
    PORT = process.env.PORT || 3000,
    router = require('./routers'),
    bodyParser  = require('body-parser'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    morgan = require('morgan'),
    Sentry = require('@sentry/node'),
    { ProfilingIntegration } = require('@sentry/profiling-node');

    Sentry.init({
    dsn: 'https://6b1b18b5cf13fd4587194d6681f4e883@o4506241260978176.ingest.sentry.io/4506252299272192',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
      // Performance Monitoring
    tracesSampleRate: 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
    });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

io.on('connect', (socket)=>{
    console.log('user conected')
    socket.on('chat',(data)=>{
      io.sockets.emit('chat',data)
    })
})


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json())

app.use(router);

app.use(Sentry.Handlers.errorHandler());

http.listen(PORT, () => console.log(`App is running at PORT ${PORT}`))

