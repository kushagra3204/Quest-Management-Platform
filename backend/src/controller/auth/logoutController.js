const logout = (req,res) => {
    res.cookie('jwt','',{maxAge: 0})
    res.send({message: "success"});
}

module.exports = logout