const mongoose = require('mongoose')
mongoose.set('debug', true)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true
})

mongoose.set('debug', true)
