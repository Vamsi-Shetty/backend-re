require("dotenv").config();

const auth = (req, res, next) => {
    const token = req.header.authorisation.split(" ")[1];
    jwt.verify(token, secret_key, function(err, decoded) {
        if(err) {
            console.log(err);
        }
        
    });
}