function mensaje(id, entidad, accion){
    let texto='';
    let tipo='';
    switch(accion){
        case 0:
        tipo= "alert alert-danger";
        texto = `<strong>Error ${entidad}!</strong> Algo salió mal.`;
        break;
        case 1:
        tipo= "alert alert-success";
        texto = `<strong>Éxito!</strong> ${entidad} agregado(a).`;
        break;
        case 2:
        tipo= "alert alert-success";
        texto = `<strong>Éxito!</strong> ${entidad} eliminado(a).`;
        break;
        case 3:
        tipo= "alert alert-success";
        texto = `<strong>Éxito!</strong> ${entidad} modificado(a).`;
        break;
        case 4:
        tipo= "alert alert-info";
        texto = `<strong>Info!</strong> ${entidad} No has hecho ningún cambio.`;
        break;
        case 5: 
        tipo= "alert alert-danger";
        texto = `<strong>Error!</strong> Rellena los campos obligatorios ${entidad}.`;
        break;
        case 6:
        tipo= "alert alert-danger";
        texto = `<strong>Error!</strong> Rangos invalidos ${entidad}.`;
        break;
        case 7:
        tipo= "alert alert-info";
        texto = `<strong>Info!</strong> Se debe registrar ${entidad}.`;
        break;
        case 8:
        tipo= "alert alert-success";
        texto = `<strong>Info!</strong> Reporte ${entidad} generado.`;
        break;
        case 10:
        tipo= "alert alert-info";
        texto = `<strong>${entidad}</strong>  No encontrado.`;
        break;
        case 11:
        tipo= "alert alert-danger";
        texto= `<strong>Error!</strong>  Contraseña demasiado corta.`;
        break;
        case 12:
        tipo= "alert alert-danger";
        texto= `<strong>Error!</strong>  Contraseñas no coinciden.`;
        break;
        case 13:
        tipo= "alert alert-danger";
        texto= `<strong>Error!</strong> ${entidad}`;
        break;
        case 14:
        tipo= "alert alert-info";
        texto= `<strong>Info!</strong> ${entidad}`;
        break;
        case 15:
        tipo= "alert alert-success";
        texto= `<strong>Éxito!</strong> ${entidad}`;
        break;


    }
    $(id).removeClass();
    $(id).addClass(tipo);
    $(id).html(texto);
    $(id).css('display', 'block');
    $(".alert").delay(8000).slideUp(200, function() {
        $(id).css('display', 'none');
    });



}
