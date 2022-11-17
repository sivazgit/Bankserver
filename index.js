// server creation

//1. import express
const express = require('express');

// Import jsonwebtoken
const jwt = require("jsonwebtoken")

const req = require('express/lib/request');

const dataService = require('./service/data.service')

// import cors
const cors = require("cors")

//2. create server app
const app = express()

// to use parse JSON
app.use(express.json())

// to use cors to share data with others

app.use(cors({
    origin:['http://localhost:4200', 'http://192.168.1.5:8080','http://127.0.0.1:8080']
}))

// Application specific middleware

const appMiddleware = (req,res,next)=>{
    console.log('Application Specific Middleware');
    next()
}

app.use(appMiddleware)

// Router specific middleware - TOKEN VALIDATION

const jwtMiddleware = (req,res,next)=>{
    try
    {
        console.log("Router specific middleware");
    const token = req.headers['x-access-token']
    const data = jwt.verify(token,"supersecretkey12345")
    console.log(data);
    next()
}
catch{
    res.status(422).json({
        statusCode:422,
        status:false,
        message:"Please log in"
    })
}
}

// 3. http request resolve

// GET request = to read data
app.get('/',(req,res)=>{
    res.send('GET METHOD')
})

// POST request = to create data
app.post('/',(req,res)=>{
    res.send('POST METHOD')
})

// PUT request = to UPDATE ENTIRE data
app.put('/',(req,res)=>{
    res.send('PUT METHOD')
})

// PATCH request = to UPDATE PARTICULAR data
app.patch('/',(req,res)=>{
    res.send('PATCH METHOD')
})

// DELETE request = to UPDATE PARTICULAR data
app.delete('/',(req,res)=>{
    res.send('DELETE METHOD')
})

// Bank app request resolving

// register api
app.post('/register',(req,res)=>{
 dataService.register(req.body.acno,req.body.password,req.body.username)
 .then(result=>{
    res.status(result.statusCode).json(result)
 })   
})

// login api
app.post('/login',(req,res)=>{
  dataService.login(req.body.acno,req.body.pswrd)
  .then(result=>{
    res.status(result.statusCode).json(result)
  })
    
})

// deposit api
app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswrd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// withdraw api
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req.body.acno,req.body.pswrd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// Transaction api
app.post('/transaction',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    try
    {
        const result = dataService.getTransaction(req.body.acno)
        .then(result=>{
            res.status(result.statusCode).json(result)
        })
}
catch{
    res.status(422).json({
        statusCode:422,
        status:false,
        message:"No transaction has been done"
    })
}
})

// onDelete api
app.delete('/onDelete/:acno',(req,res)=>{
    dataService.onDelete(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


// 4. set up port number
app.listen(3000,()=>{
    console.log('server started at port 3000');
})