$(document).ready(function () {

    const tablaRoles = $('#dtRoles').DataTable({
        "language": {
            "lengthMenu": "",
            "search": "Buscar:",
            "paginate": {
                "previous": "Anterior",
                "next": "Siguiente"
            },
            "emptyTable": "No se encontraron roles",
            "zeroRecords": "No se encontraron roles"
        },
        "searching": true,
        "ordering": true,
        "paging": true
    });
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/roles',
        contentType: 'application/json',
        type: 'GET',
        success: function (res, status, xhr) {
            res.data.map(function (roles) {
                let ids_f = []
                let nombres_f = []
                roles.funcionalidades.map(function (funcion) {
                    ids_f.push(funcion.id_funcionalidad)
                    nombres_f.push(funcion.nombre)
                })
                addRowRoles(roles.id_rol, roles.nombre, roles.descripcion, nombres_f)
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    })

    $('#ms_funcionalidades').multiSelect({
        selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
        selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='buscar...'>",
        selectableOptgroup: true ,
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
        afterSelect: function (values) {
            this.qs1.cache();
            this.qs2.cache();

        },
        afterDeselect: function (values) {
            this.qs1.cache();
            this.qs2.cache();

        }
    });

    $('#btnAceptar').on('click', function () {

        if ($('#ms_funcionalidades').val().length == '0') {
            mensaje('#msjAlertaA', `funcionalidades`, 5);
            return;
        }
        if ($('#txtNombre').val() == "") {
            $('#txtNombre').css('border', '1px solid red');
            return;
        }
        else {
            $('#txtNombre').css('border', '1px solid #767676');
        }
        if ($('#txtDescripcion').val() == "") {
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        } else {
            $('#txtDescripcion').css('border', '1px solid #858580');
        }

        let func = limpiarFuncionalidad();

        let rol = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            funcionalidades: func,
        }


        $.ajax({
            url: 'https://api-sascha.herokuapp.com/roles',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(rol),
            success: function (res, status, xhr) {
                const rol1 = res.data
                console.log(rol1)
                let nombres_f = []
                rol1.funcionalidades.map(function (funcion) {
                    nombres_f.push(funcion.nombre)
                })
                limpiarRol()
                mensaje('#msjAlerta', `Rol`, 1);
                addRowRoles(rol1.id_rol, rol1.nombre, rol1.descripcion, nombres_f);
                // agregarFuncionalidades(rol1.id_rol)
                $('#myModal .close').click();
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            }
        })

    })

    
    $('#btnAgregarRolNuevo').on('click', function(){
        estatusCampos(false)
        $('#btnAceptar').css('display', 'inline');
        $('#btnEditar').css('display', 'none');
        $('#btnCancelar').html('Cancelar');
        

    })

    $('#btnEditar').on('click', function () {
        if ($('#txtNombre').val() == "") {
            $('#txtNombre').css('border', '1px solid red');
            mensaje('#msjAlertaA', '', 5)
            return;
        }
        else {
            $('#txtNombre').css('border', '1px solid #858580');
        }
        if ($('#txtDescripcion').val() == "") {
            $('#txtDescripcion').css('border', '1px solid red');
            mensaje('#msjAlertaA', '', 5)

            return;
        } else {
            $('#txtDescripcionE').css('border', '1px solid #858580');
        }

        let id = $('#txtIdRol').val();
        // if ($('#txtDescripcionE').val() == $(`#descripcion-${id}`).text() && $('#txtNombreE').val() == $(`#nombre-${id}`).text()) {
        //     mensaje('#msjAlerta', ``, 4);
        //     $('#editarRoles').modal('hide');
        //     return;
        // }

        let func = limpiarFuncionalidad()
        let rol = {
            nombre: $('#txtNombreE').val(),
            descripcion: $('#txtDescripcionE').val(),
            funcionalidades: func
        }



        $.ajax({
            url: `https://api-sascha.herokuapp.com/role/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(rol),
            success: function (res, status, xhr) {
                console.log(res.data)
                let nombres = []
                res.data.funcionalidades.map(function (f) {
                    nombres.push(f.nombre)
                })
                editRowRoles(id, res.data.nombre, res.data.descripcion, nombres)
                limpiarRol()
                mensaje('#msjAlerta', `Rol`, 3);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText)
                mensaje('#msjAlerta', respuesta.data.mensaje, 0);
            }
        })
        $('#myModal').modal('hide')
    })


});


function addRowRoles(id, nombre, descripcion, nombres_f) {
    let row = $(`<tr>
        <td id="nombre-${id}">${nombre}</td>
        <td id="descripcion-${id}">${descripcion}</td>
        <td hidden id="funcionalidades-${id}">${nombres_f}</td>
        <td>
        <button onclick="verRoles(${id})" type='button' class='btn  btn-stransparent' data-toggle="modal" data-target="#myModal"  title='Ver'><i class='fa fa-eye'></i></button>        
            <button onclick="editarRoles(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#myModal"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarRoles(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarRoles" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>        
        </tr>
        `);
    $('#dtRoles').DataTable().row.add(row).draw();
}

function verRoles(id){
    $('#txtNombre').val($(`#nombre-${id}`).text());
    $('#txtDescripcion').val($(`#descripcion-${id}`).text());
    $('#txtIdRol').val(id);
    estatusCampos(true);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'none');
    $('#btnCancelar').html("Cerrar");
    let nombres_f = $(`#funcionalidades-${id}`).text().split(',')
    let ids = convertirFunciones(nombres_f)
    $('#ms_funcionalidades').multiSelect('select', ids)
    $('#ms_funcionalidades').attr('disabled', true)
    

}

function estatusCampos(estado){
    $('#txtNombre').attr('disabled',estado)
    $('#txtDescripcion').attr('disabled',estado)
}

function limpiarRol() {
    estatusCampos(false)
    $('#txtNombre').val('');
    $('#txtDescripcion').val('');
    $('#txtNombreE').val('');
    $('#txtDescripcionE').val('');
    $('#ms_funcionalidades').multiSelect('deselect_all')
}
function editarRoles(id) {
    estatusCampos(false)
    $('#txtNombre').val($(`#nombre-${id}`).text());
    $('#txtDescripcion').val($(`#descripcion-${id}`).text());
    $('#txtIdRol').val(id);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'inline');
    $('#btnCancelar').html("Cancelar");
    let nombres_f = $(`#funcionalidades-${id}`).text().split(',')
    let ids = convertirFunciones(nombres_f)
    $('#ms_funcionalidades').multiSelect('select', ids)
}

function abrirModalEliminarRoles(id) {
    $('#txtIdRolEliminar').val(id);
}

function editRowRoles(id, nombre, descripcion, nombres) {

    $(`#nombre-${id}`).text(nombre);
    $(`#descripcion-${id}`).text(descripcion);
    $(`#funcionalidades-${id}`).text(nombres);

}

function eliminarRoles(id) {
    $.ajax({
        url: `https://api-sascha.herokuapp.com/role/${id}`,
        contentType: 'application/json',
        type: 'DELETE',
        success: function (res, status, xhr) {
            console.log(res);
            console.log(status);
            mensaje('#msjAlerta', `Rol`, 2);
            $('#dtRoles').DataTable().row($(`#nombre-${id}`).parent()).remove().draw();
            $('#eliminarRoles .close').click();
        },
        error: function (res, status, xhr) {
            console.log(res);
            console.log(status);
        }
    })
}



function limpiarFuncionalidad() {
    let valores = $('#ms_funcionalidades').val()
    let aux = []
    valores.map(function (v) {
        let prueba = v.split('-')
        aux = aux.concat(prueba)
    })
    let func = []
    aux.map(function (funcionalidad) {
        let enc = false
        for (let i = 0; i < func.length; i++) {
            if (func[i].id_funcionalidad == funcionalidad) {
                enc = true;
                break;
            }
        }
        if (!enc && funcionalidad != "0") {
            func.push({
                id_funcionalidad: funcionalidad
            })
        }
    })
    return func
}

function convertirFunciones(ids) {
    let ids_f = []
    ids.map(function (nombre) {
        let opcion = $('#ms_funcionalidades option:contains(' + nombre + ')')
        if (opcion.text() == nombre) {
            ids_f.push(opcion.val())
        }
    })
    return ids_f;
}