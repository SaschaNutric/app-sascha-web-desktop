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
        texto = `<strong>Oye!</strong> ${entidad} No has hecho ningún cambio.`;
        break;
        case 5: 
        tipo= "alert alert-danger";
        texto = `<strong>Error!</strong> Rellena los campos obligatorios.`;
        case 10:
        tipo= "alert alert-info";
        texto = `<strong>${entidad}</strong>  No encontrado.`;



    }
    $(id).removeClass();
    $(id).addClass(tipo);
    $(id).html(texto);
    $(id).css('display', 'block');
    $(".alert").delay(3000).slideUp(200, function() {
        $(id).css('display', 'none');
    });



}
