$('#btnProcesar').on('click', function(){

    llenarBarra()
})
let opcion="";
let gestion="";

function validarForm(){
    if($('#selOperacion').val()==0){        
        mensaje('#msjAlerta', `Operación`, 5);
        return false;
    }    
    opcion = $('select[name="operacion"] option:selected').text();
    if($('#check1').prop('checked')){
        gestion="Gestion de Cliente";
    }else if($('#check2').prop('checked')){
        gestion="Gestion de Servicio";
    }else if($('#check3').prop('checked')){
        gestion="Gestion de Post-Servicio";
    }else{
        gestion="Gestion de Escucha al Cliente";
    }
    return true;
}

function llenarBarra(){
if(validarForm()){
$('#myModal').modal('show');
    let ancho=0;
    for (var i=0; i<100; i++){                 
            $(".progress-bar").delay(50).show(400, function() {
                ancho=ancho+1;
                $("#barraProgreso").css('width', ancho + '%');
                if(ancho==100){
                    $('#btnCerrar').css('display', 'inline')
                    mensaje('#msjAlertaA', opcion + " de " + gestion + ` Listo`, 15);
                }
            });
        } 
}

}

