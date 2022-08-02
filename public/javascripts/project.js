$(document).ready(function(){

    $.getJSON('/statecity/fetchallstates',function(data){
        // alert(JSON.stringify(data))
        if(data.status){
        data.result.map((item)=>{
            $('#state').append($('<option>').text(item.statename).val(item.stateid))
        })
        $('#state').formSelect();
        }
        else{
            alert('Server Error')
        }
    })
    
    $('#state').change(function(){

        $.getJSON('/statecity/fetchallcity',{stateid:$('#state').val()},function(data){

            if(data.status){
                $('#city').empty()
                $('#city').append($('<option disable selected>').text('Choose your City'))        
                data.result.map((item)=>{
                $('#city').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#city').formSelect();
            }
            else{
                alert('Server Error')
            }
        })
    
    })

})