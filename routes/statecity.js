const { json } = require('express')
var express=require('express')
var router=express.Router()
var pool=require('./pool')

//This Action Create For PostMan API..
router.post('/insertstate',function(req,res){
    pool.query('insert into states values(?,?)',[req.body.stateid,req.body.statename],function(error,result){
        if(error){
            console.log('xxxxxxxxxx',error)
         res.status(500).json({status:false,result:"Fail to Record Submit"})   
        }
        else{
            res.status(200).json({status:true,result:'Success'})
        }
    })
})
//....................................

router.get('/fetchallstates',function(req,res){
    pool.query('select * from states',function(error,result){
        if(error){
            res.status(500).json({status:false})
        }
        else{
            res.status(200).json({status:true,result:result})
        }
    })
})


router.get('/fetchallcity',function(req,res){
    pool.query('select * from cities where stateid=?',[req.query.stateid],function(error,result){
        if(error){
            res.status(500).json({status:false})
        }
        else{
            res.status(200).json({status:true,result:result})
        }
    })
})

module.exports=router