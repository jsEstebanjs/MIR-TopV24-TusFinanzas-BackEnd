module.exports.send = (req,res)=>{
    res.status(200).json({...req.body})
  }