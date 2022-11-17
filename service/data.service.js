// Import jsonwebtoken
const jwt = require("jsonwebtoken")

// import db
const db = require('./db')

// Database
userDetails = {
    1000:{acno:1000,username:'Neer',password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,username:'Laisha',password:1001,balance:6000,transaction:[]},
    1002:{acno:1002,username:'Vyom',password:1002,balance:4000,transaction:[]}
  }


// Register

const register = (acno,password,username)=> {
  // asynchronous call
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode:401,
        status:false,
        message:'User already exist.... Please log in'
      }
    }
    else{
      const newUser = new db.User({
        acno,
    username,
    password,
    balance:0,
    transaction:[]
      })
      newUser.save()
      return {
        statusCode:200,
        status:true,
        message:'Registered Successfully'
      }
    }
  })

  }

  // login()

  const login = (acno,pswrd)=>{
    // asynchronous call
    return db.User.findOne({
      acno,
      password:pswrd
    })
    .then(user=>{
      if(user){
          currentUsername = user.username
          currentAcno = acno

          // token generation using jwt

         const token = jwt.sign({
          currentAcno:acno
         },"supersecretkey12345")

         return {
            statusCode:200,
            status:true,
            message:'Login Successfull',
            token,
            currentUsername,
            currentAcno
          } 

        }
        else{
          return {
            statusCode:401,
            status:false,
            message:'Incorrect account number / password'
          }
      }
      
    })
      
  }


  // DEPOSIT

  const deposit = (acno,pswrd,amt)=>{
    var amount = parseInt(amt)
    return db.User.findOne({
      acno,
      password:pswrd
    })
    .then(user=>{
      if(user){
        user.balance += amount
        user['transaction'].push({
          type:"CREDIT",
          amount
        })
        user.save()
        return{
          statusCode:200,
          status:true,
          message:`${amount} credited. New Balance is ${user.balance}`
        }
      }
      else{
        return {
          statusCode:401,
          status:false,
          message:'Incorrect password'
        }
      }
    })

  }


// WITHDRAW

const withdraw = (acno,pswrd,amt)=>{
  
  var amount=parseInt(amt)
  // asynchronous call
  return db.User.findOne({
    acno,
    password:pswrd
  })
  .then(user=>{
    if(user){
      if(user.balance>amount){
      user.balance -= amount
      user['transaction'].push({
        type:"DEBIT",
        amount
      })

      user.save()
        return{
          statusCode:200,
          status:true,
          message:`${amount} Debited. New Balance is ${user.balance}`
        }
      }
      else{
        return {
          statusCode:401,
          status:false,
          message:'Insufficient balance'
        }
      }
    }
    else{
      return {
        statusCode:401,
        status:false,
        message:'Incorrect password / Account number'
      }
    }
    })

}


// TRANSACTION
const getTransaction = (acno)=>{
  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return {
                statusCode:200,
                status:true,
                transaction:user['transaction']
    
      }
    }
    else{
      return {
        statusCode:401,
        status:false,
        message:'Incorrect password / Account number'
      }
    }
  })
}

// onDelete()

const onDelete = (acno)=>{
  return db.User.deleteOne({acno})
  .then(result=>{
    if(result){
      return {
        statusCode:200,
        status:true,
        message:'Deleted Successfully'

}
    }
    else{
      return {
        statusCode:401,
        status:false,
        message:'Incorrect Account Number'

}
    }
  })
  
}



//   to export
module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    onDelete
}