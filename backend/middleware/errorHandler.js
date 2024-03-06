//error->object
//next->use middleware
const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production'? null : err.stack,
    })
    // console.log('come to error handler midlle ware')
    // console.log(statusCode)
}

module.exports={
    errorHandler  
}