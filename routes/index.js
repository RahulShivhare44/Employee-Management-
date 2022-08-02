const { json } = require('express');
var express=require('express')
var router=express.Router()
var pool=require('./pool')
var LocalStorage= require('node-localstorage').LocalStorage;
var localStorage= new LocalStorage('./scratch');

router.get('/adminlogin',function(req,res){
    res.render('admin',{msg:''})
})

router.post('/checkadmin',function(req,res){
    pool.query("select * from admins where emailid=? and password=?",[req.body.email,req.body.password],function(error,result){
        if(error){
            res.render('admin',{msg:'Server Error'})
        }
        else{
            if(result.length==1){
                localStorage.setItem("admin",JSON.stringify(result[0]))
                console.log(result[0])
                res.render('index'),{data:result[0]};    
            }
            else{
                res.render('admin',{msg:'Invalid Email/Password'})
            }
        }
    })
    
})

router.get('/dashboard',function(req,res){
  res.render('index',{data:JSON.parse(localStorage.getItem("admin"))})
})

router.get('/adminlogout',function(req,res){
    localStorage.clear();
    res.render('admin',{msg:''})
})


module.exports=router
