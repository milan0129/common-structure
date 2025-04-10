require("dotenv").config();
let express = require('express');
let middleware = require('./middleware/headerValidator');
let app = express();
let cors = require('cors');
app.use(cors());
let auth = require('./modules/v1/auth/route');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(middleware.validateHeaderApiKey);

app.use('/api/v1/auth/', auth);

try {
    app.listen(process.env.PORT);
    console.log("Connected successfully on port:", process.env.PORT);
} catch (error) {
    console.error("Error occurred: ", error);
}