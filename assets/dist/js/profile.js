function getLogedBoy(){
    $.ajax({
        type: 'GET',
        url: ""+$.cookie('id_user_logged'),
        headers: {
            'Authorization':"Bearer "+token
        },
        success: function(response){
            $('#nom').val(response[0]["user"]['nom'])
            $('#prenom').val(response[0]["user"]['prenom'])
            $('#login').val(response[0]["user"]['login'])
            $('#email').val(response[0]["user"]['email'])
            $('#telephone').val(response[0]['telephone'])
            $('#adresse').val(response[0]['adresse'])
            $('#type_user').val($.cookie("group"))
            $('#text_role').text($.cookie("group"))
            if($.cookie("group")=="Agent constat"){
                $('#trigramme').val(response[0]['trigramme'])
                $('#as').css('display','inline')
                $('#tri').css('display','inline')
                getAs(2,2,response[0]["agent_secteur"])
                $('#as_val').prop("disabled",true)
            }
            if($.cookie("group")=="Agent secteur"){
                $('#trigramme').val(response[0]['trigramme'])
                $('#secteur_primaire').val(response[0]['secteur_primaire'])
                $('#secteur_secondaire').val(response[0]['secteur_secondaire'])
                $('#secteur').css('display',"inline")
                $('#tri').css('display','inline')
            }
            if($.cookie("group")=="Audit planneur"){
                $('#trigramme').val(response[0]['trigramme'])
                $('#tri').css('display','inline')
            }
            if($.cookie("group")=="Administrateur"){
                $('#tri').css('display','none')
            }
            if($.cookie("group")=="Salarie"){
                $('#titre').val(response[0]['titre'])
                $('#fonction').val(response[0]['fonction'])
                $('#mobile').val(response[0]['mobile'])
                $('#code').val(response[0]['code'])
                $('#company').val(response[0]['client']['societe'])
                $('#client_nom').val(response[0]['client']['nom'])
                $('#client_id').val(response[0]['client']['id'])
                //getClient(1,response[0]['client']["id"])
                $('#sal_bloc2').css("display","inline")
                $('#sal_bloc3').css("display","inline")
                $('#as').empty()
                $('#as').css('display','none')
                $('#secteur').css('display',"none")
                $('#sal_bloc1').css("display","inline")
                $('#tri').css('display','none')
                
            }
            if($.cookie("group")=="Client pro" || $.cookie("group")=="Client particulier" ){
                $('#as').css('display','inline')
                getAs(2,2,response[0]['info_concession']['agent_rattache']["id"])
                $('#tri').css('display','none')
            }  
        },
        error: function(response){
            $('#login_error').css('display','inline')
        }
    })
}


$('#goProfile').on('click',function(){
    var id =""
    id = $.cookie('id_user_logged')
    var url = ""
    var data = {}

    if(!$('#login').val() || !$('#nom').val() || !$('#prenom').val() || !$('#email').val() || !$('#adresse').val() || !$('#telephone').val()){
        $('#error_form').css('display','inline')
        return
    }
    data['nom'] = $('#nom').val()
    data['prenom'] = $('#prenom').val()
    data['login'] = $('#login').val()
    if(!$('#mdp').val()){

    }else{
        data['mdp'] = $('#mdp').val()
    }
    data['email'] = $('#email').val()
    data['adresse'] = $('#adresse').val()
    data['telephone'] = $('#telephone').val()
    if($.cookie("group")=="Agent constat"){
        url = agent_add+id.toString()
        data['agent_secteur'] = $('#as_val').val()
        data['trigramme'] = $('#trigramme').val()
        data['role']=2
    }
    if($.cookie("group")=="Agent secteur"){
        url = agent_add+id.toString()
        if(!$('#secteur_primaire').val()){
            $('#s1_error').css("display","inline")
            return
        }
        data['secteur_primaire']= $('#secteur_primaire').val()
        data['secteur_secondaire']=$('#secteur_secondaire').val()
        data['role']=1
        data['trigramme'] = $('#trigramme').val()
    }
    if($.cookie("group")=="Audit planneur"){
        url = agent_add+id.toString()
        data['agent_secteur'] = $('#as_val').val()
        data['trigramme'] = $('#trigramme').val()
        data['role']=3
    }
    if($.cookie("group")=="Administrateur"){
        url = admin_add+id.toString()
    }
    if($.cookie("group")=="Salarie"){
        if($.cookie("group") == "Client pro"){
            data['client'] = $.cookie('id_user_logged')
        }else{
            data['client'] = $("#client_id").val() 
        }
        data['fonction'] = $('#fonction').val()
        data['mobile'] = $('#mobile').val()
        data['titre'] = $('#titre').val()
        data['code'] = $('#code').val()
        url = salarie_add+id.toString()
    }
    if($.cookie("group")=="Client pro" || $.cookie("group")=="Client particulier"){
        data['email_reponsable'] = $('#email').val()
        data['type'] = 0
        url = client_add+id.toString()
    }
    
    $.ajax({
        type: 'PUT',
        url: url,
        headers: {
            'Authorization':"Bearer "+token
        },
        data: data,
        success: function (response) {
            alert('Mise à jour du profil réussie')
            //clearForm()
        },
        error: function (response) {
            alert('Echec Mise à jour profil') 
        }
    })

})
