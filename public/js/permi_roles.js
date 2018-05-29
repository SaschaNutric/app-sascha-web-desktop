var datos = [];
$(document).ready(function () {
    /* Cargar Multiselect */
    // document.getElementById('selFuncionalidades').length = 1;
    // $.ajax({
    //     url: 'https://api-sascha.herokuapp.com/funcionalidades',
    //     contentType: 'application/json',
    //     type: 'GET',
    //     success: function(res, status, xhr) {
    //         res.data.map(function(funcionalidad) {
    //             let option = $(`<option value="${funcionalidad.id_funcionalidad}">${funcionalidad.nombre}</option>`)
    //             $('#ms_funcionalidades').append(option);
    //             $('#ms_funcionalidades').multiSelect('refresh')
    //         })

    //     },
    //     error: function(res, status, xhr) {

    //     }
    // })
    /* tabla tipo de parametros */
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
                console.log(res.data)
                let ids_f = []
                let nombres_f = []
                roles.funcionalidades.map(function (funcion) {
                    ids_f.push(funcion.id_funcionalidad)
                    nombres_f.push(funcion.nombre)
                })
                let funciones_multiselect = convertirFunciones(nombres_f)
                addRowRoles(roles.id_rol, roles.nombre, roles.descripcion, funciones_multiselect, nombres_f)
            })

        },
        error: function (res, status, xhr) {
            console.log(res)
        }
    })

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
        afterSelect: function (values) {
            this.qs1.cache();
            this.qs2.cache();
            console.log(values)
            let ids = values[0].split('-')
            for (let i = 0; i < ids.length; i++) {
                datos.push(ids[i])
            }
        },
        afterDeselect: function (values) {
            this.qs1.cache();
            this.qs2.cache();
            let ids = values[0].split('-')
            for (let i = 0; i < ids.length; i++) {
                let index = datos.indexOf(ids[i])
                if (index != -1) {
                    datos.splice(index, 1)
                }
            }
        }
    });

    $('#btnAceptar').on('click', function () {

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
        console.log(datos.length)
        if (datos.length == '0') {
            mensaje('#msjAlertaA', `funcionalidades`, 5);
            return;
        }

        let func = limpiarFuncionalidad();
        console.log(func)

        let rol = {
            nombre: $('#txtNombre').val(),
            descripcion: $('#txtDescripcion').val(),
            funcionalidades: func,
        }


        $.ajax({
            url: 'https://api-sascha.herokuapp.com/roles', //'https://api-sascha.herokuapp.com/roles',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(rol),
            success: function (res, status, xhr) {
                console.log(res.data);
                console.log(status);
                const rol1 = res.data
                let ids_f = []
                let nombres_f = []
                rol1.funcionalidades.map(function (funcion) {
                    ids_f.push(funcion.id_funcionalidad)
                    nombres_f.push(funcion.id_nombre)
                })
                limpiarRol()
                mensaje('#msjAlerta', `Rol`, 1);
                addRowRoles(rol1.id_rol, rol1.nombre, rol1.descripcion, ids_f, nombres_f);
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
                console.log(res);
                console.log(status);
                editRowRoles(id, rol.nombre, rol.descripcion)
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
    })



});

function agregarFuncionalidades(id) {

    datos.map(function (funcionalidad) {
        let rol = {
            id_rol: id,
            id_funcionalidad: funcionalidad
        }
        console.log(funcionalidad)

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/rolfuncionalidades',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(rol),
            success: function (res, status, xhr) {
                console.log(res);
                console.log(status);
            },
            error: function (res, status, xhr) {
                console.log(res);
                console.log(status);
            }
        })
    });
}

function addRowRoles(id, nombre, descripcion, ids_f, nombres_f) {
    let row = $(`<tr>
        <td id="nombre-${id}">${nombre}</td>
        <td id="descripcion-${id}">${descripcion}</td>
        <td id="funcionalidades-${id}">${nombres_f}</td>
        <td>
            <button onclick="editarRoles(${id})" type='button' class='edit btn  btn-stransparent' data-toggle="modal" data-target="#myModal"  title='Editar'><i class='fa fa-pencil'></i></button>
            <button onclick="abrirModalEliminarRoles(${id})" type='button' class='ver btn  btn-stransparent' data-toggle='modal' data-target="#eliminarRoles" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        <td hidden id="id_funcionalidades-${id}">${ids_f}</td>
        
        </tr>
        `);
    $('#dtRoles').DataTable().row.add(row).draw();
}

function limpiarRol() {
    $('#txtNombre').val('');
    $('#txtDescripcion').val('');
    $('#txtNombreE').val('');
    $('#txtDescripcionE').val('');
    $('#ms_funcionalidades').multiSelect('deselect_all')
}
function editarRoles(id) {
    $('#txtNombre').val($(`#nombre-${id}`).text());
    $('#txtDescripcion').val($(`#descripcion-${id}`).text());
    $('#txtIdRol').val(id);
    $('#btnAceptar').css('display', 'none');
    $('#btnEditar').css('display', 'inline');
    let ids = $(`#id_funcionalidades-${id}`).text().split(',')
    $('#ms_funcionalidades').multiSelect('select', ids)
}

function abrirModalEliminarRoles(id) {
    $('#txtIdRolEliminar').val(id);
}

function editRowRoles(id, nombre, descripcion) {

    $(`#nombre-${id}`).text(nombre);
    $(`#descripcion-${id}`).text(descripcion);

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
    let func = []
    datos.map(function (funcionalidad) {
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
    for (let i = 0; i < ids.length; i++) {
        let opcion = $('#ms_funcionalidades option:contains(' + ids[i] + ')')
        if(opcion.text() == ids[i]){
            ids_f.push(opcion.val())
        }

    }

    return ids_f;
}