// require('dotenv').config()

// const express = require('express');
// const ejs = require('ejs');
// const path = require('path');
// const cors = require('cors');
// const cron = require('node-cron');
// let app = express();
// app.disable("x-powered-by");
// const moment = require('moment');
// moment.locale('en');

// app.use(cors());
// // Setting up express for text parser
// app.use(express.text());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// ////ROUTE MANAGER 
// const routes = require('./models/v1/route_manager');
// const cronModel = require('./models/v1/cron/cron.model')

// //////////////////////////////////////////////////////////////////////
// //                           api document                           //
// //////////////////////////////////////////////////////////////////////

// app.engine('html', ejs.renderFile);

// app.set('view engine', 'ejs');

// let api_doc = require('./api_document/index');

// app.use('/v1/api_document', api_doc);
// app.use('/api/v1', routes);

// //------------------------------------------------------------

// cronModel.send_newsletter();


// cron.schedule('0 */1 * * * *', () => {
//     console.log("It's working every minutes")
//     cronModel.send_newsletter(()=>{});
// });


// app.use("*", (req, res) => {
//     res.status(404);
//     res.send('404 Not Found');
// });

// try {
//     const port = process.env.PORT || 5551;
//     let server = app.listen(port);
//     server.setTimeout(50000);

//     console.log(`😈 SourceNow App Running ⚡ On at ${port}`);
// } catch (err) {
//     console.log('err :', err);
//     console.log("Failed to connect");
// }

require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const PORT = 1725;
const routes = require('./models/v1/route_manager');
app.use(cors());
app.use(express.text());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1', routes);


app.listen(PORT, (err) => {
    if (err) {
        console.error('Connection Failed:', err);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
