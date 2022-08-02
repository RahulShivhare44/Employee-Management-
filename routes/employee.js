var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload = require('./multer');
var fs= require('fs')
var LocalStorage= require('node-localstorage').LocalStorage;
var localStorage= new LocalStorage('./scratch');

router.get('/employeeinterface', function(req, res, next) {
    var result=JSON.parse(localStorage.getItem('admin')) 
    console.log('xxxxxxxxxxx',result)
    if(result)
     res.render('employeeinterface',{status:null});
    else
     res.render('admin',{msg:''})
});

router.post('/submit_employee_record',upload.single('picture'),function(req,res){
    console.log('Body:',req.body)
    console.log('File',req.file)
    var name=req.body.firstname+' '+req.body.lastname
    var dob=new Date(req.body.dob)
    
    pool.query('insert into employee(employeename, dob, gender, address, state, city, emailaddress, contactnumber, picture) values(?,?,?,?,?,?,?,?,?)',[name,dob,req.body.gender,req.body.address,req.body.state,req.body.city,req.body.emailaddress,req.body.contactnumber,req.file.filename],function(error,result){
        if(error)
        {console.log('xxxxxxxxxxxx',error)
         res.render('employeeinterface',{status:0})   
        }
        else{
            res.render('employeeinterface',{status:1})
        }
    })
})

router.get('/displayallemployee',function(req,res){
    var result=JSON.parse(localStorage.getItem('admin'))
    if(!result)
     res.render('admin',{msg:''})
    pool.query('select  E.*,(select cityname from cities C where C.cityid=E.city) as tcity from employee E',function(error,result){
        console.log(result)
        if(error){
            console.log(error)
            alert(error)
            res.render('displayallemployee',{data:''})
        }
        else{
            console.log(result)
            res.render('displayallemployee',{data:result})
        }
    })
    
    

})

router.get('/displaybyid',function(req,res){
    pool.query('select *,(select statename from states S where S.stateid=E.state) tstate,(select cityname from cities C where C.cityid=E.city) tcity from employee E where employeeid=?',[req.query.eid],function(error,result){
        if(error){
            res.render('displaybyid',{data:''})
        }
        else{
            res.render('displaybyid',{data:result[0]})
        }
    })
})
  
router.post('/editdeleterecord',function(req,res){
    if(req.body.btn=='Edit'){
        var name=req.body.firstname+' '+req.body.lastname
        var dob=new Date(req.body.dob)
        pool.query('update employee set employeename=?,dob=?,gender=?,address=?,state=?,city=?,emailaddress=?,contactnumber=? where employeeid=?',[name,dob,req.body.gender,req.body.address,req.body.state,req.body.city,req.body.emailaddress,req.body.contactnumber,req.body.employeeid],function(error,result){
        if(error){
            res.redirect('/employee/displayallemployee')
        }
        else{
            res.redirect('/employee/displayallemployee')
        }
    })
    }
    else{
        pool.query('delete from employee where employeeid=?',[req.body.employeeid],function(error,result){
            if(error){
                res.redirect('/employee/displayallemployee')
            }
            else{
                res.redirect('/employee/displayallemployee')
            }
               
        })
    }
})

router.get('/displaybypicture',function(req,res){
   
            res.render('displaybypicture',{eid:req.query.eid,en:req.query.en,picture:req.query.picture})
})

router.post('/editpicture',upload.single('picture'),function(req,res){
    pool.query('update employee set picture=? where employeeid=?',[req.file.filename,req.body.eid],function(error,result){
        if(error){
            res.redirect('/employee/displayallemployee')
        }
        else{
            fs.unlinkSync('d:/employeemanagement/public/images/'+req.body.oldpic)
            res.redirect('/employee/displayallemployee')
        }
    })
})

module.exports=router
