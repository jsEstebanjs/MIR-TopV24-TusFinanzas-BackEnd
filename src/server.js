const app = require('./app');
const { connect } = require('./database');

const port = process.env.PORT

connect();

app.listen(port,()=>{
    console.log("app is run")
})