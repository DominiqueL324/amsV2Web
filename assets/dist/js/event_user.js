$("#telephone").keyup(function () {
    var min = $("#telephone").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhone").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhone").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#tel_agence").keyup(function () {
    var min = $("#tel_agence").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneA").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneA").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#mobile").keyup(function () {
    var min = $("#mobile").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneM").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneM").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#telephone_service_gestion").keyup(function () {
    var min = $("#telephone_service_gestion").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneTG").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneTG").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#mobile_service_gestion").keyup(function () {
    var min = $("#mobile_service_gestion").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneMG").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneMG").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#mobile_comptable").keyup(function () {
    var min = $("#mobile_comptable").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneMC").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneMC").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})

$("#telephone_comptable").keyup(function () {
    var min = $("#telephone_comptable").val()
    min = min.toString()
    if( (min.length < 10 || min.length >10) || min.charAt(0)!= "0"){
        $("#erreurPhoneTC").css('display','inline')
        $("#go").css('display','none')
        $("#goEdit").css('display','none')
    }else{
        $("#erreurPhoneTC").css('display','none')
        $("#go").css('display','inline')
        $("#goEdit").css('display','inline')
    }
})