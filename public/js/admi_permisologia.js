$(document).ready(function() {
  

$('#ms_funcionalidades').multiSelect({
    selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
    afterInit: function (ms) {

        var that = this,
            $selectableSearch = that.$selectableUl.prev(),
            $selectionSearch = that.$selectionUl.prev(),
            selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
            selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

        that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
            .on('keydown', function (e) {
                if (e.which === 40) {
                    that.$selectableUl.focus();
                    return false;
                }
            });

        that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
            .on('keydown', function (e) {
                if (e.which == 40) {
                    that.$selectionUl.focus();
                    return false;
                }
            });
    },
    afterSelect: function () {
        this.qs1.cache();
        this.qs2.cache();
    },
    afterDeselect: function () {
        this.qs1.cache();
        this.qs2.cache();
    }
});




});

function crearUsuario() {
    let password = $('#txtContraseñaNueva').val();
    let confirmPass = $('txtRepContraseña').val();
    if(password !== confirmPass){
        let mensaje = document.getElementById('msjAgregar');
        mensaje.innerHTML += `<strong>Error!</strong> Las contraseñas no coinciden.`;
        mensaje.style.display = 'block';
        return;
    }

    let usuario = {
        cedula : $('#txtCedula').val(),
      nombre_usuario:   $('#txtUsuarioNuevo').val(),
      correo:           $('#txtCorreoNuevo').val(),
      contraseña:       password,
      id_rol:        $('select[name=selRoles]').val(),
    }

    $.ajax({
        url: 'https://api-sascha.herokuapp.com/usuarios',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(usuario),
        success: function (res, status, xhr) {
            console.log("todo bien");
        },
        error: function (res, status, xhr) {
            const respuesta = JSON.parse(res.responseText);
            
        }
    })
      
  }

