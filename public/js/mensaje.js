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
        texto = `<strong>Error!</strong> Rellena los campos obligatorios.`;
<<<<<<< HEAD
        case 10:
        tipo= "alert alert-info";
        texto = `<strong>${entidad}</strong>  No encontrado.`;


=======
        break;
        case 6:
        tipo = "alert alert-danger";
        texto = `<strong>Error!</strong> Rangos inválidos.`;
        break;
        case 7:
        tipo = "alert alert-info";
        texto = `<strong>Info!</strong> Debes registrar el(la) ${entidad} primero.`;
        break;
        case 8:
        tipo= "alert alert-success";
        texto = `<strong>Éxito!</strong> ${entidad} configurado como filtro.`;
        break;
        case 9:
        tipo= "alert alert-success";
        texto = `<strong>Éxito!</strong> ${entidad} ha dejado ser filtro.`;
>>>>>>> 2116ed4ea389e6cc1c5ed8fe511cc3074e3d0449

    }
    $(id).removeClass();
    $(id).addClass(tipo);
    $(id).html(texto);
    $(id).css('display', 'block');
    $(".alert").delay(8000).slideUp(200, function() {
        $(id).css('display', 'none');
    });



}
