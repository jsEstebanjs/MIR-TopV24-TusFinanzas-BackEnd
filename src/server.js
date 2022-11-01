const app = require('./app');
const { connect , cleanup , disconnect } = require('./database');

const port = process.env.PORT

connect();


app.listen(port,()=>{
    console.log("app is run")
})