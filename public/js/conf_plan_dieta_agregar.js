let arrcomidas=[];
let valor=[];
let idtabla = 0;
$(document).ready(function() {
    var tablaComidas = $('#dtComidaGrupo').DataTable( {
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 2 ] }
        ],
        "searching": "Buscar",
        "language": {
        "lengthMenu": "",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron comidas",
        "zeroRecords": "No se encontraron comidas"
        },
        "searching": true,
        "ordering": true,
        "paging": true 
    } );

    $('#selGruposAlimenticios').multiSelect({
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
            valor.push(values[0]);
            console.log(valor);
        },
        afterDeselect: function (values) {
            this.qs1.cache();
            this.qs2.cache();
            const index = valor.indexOf(values[0])
            if (index != -1){
                valor.splice(index,1)
            }
            console.log(valor)
        }
    });

    /* llena el select de los tipos de dietas */
    $.ajax({
        url: 'https://api-sascha.herokuapp.com/tipodietas',
        contentType: 'application/json',
        type: 'GET',
        success: function(res, status, xhr) {
            res.data.map(function(tipoDieta) {
                let option = $(`<option value="${tipoDieta.id_tipo_dieta}">${tipoDieta.nombre}</option>`)
                $('#selTipoDieta').append(option);
            })
        },
        error: function(res, status, xhr) {
            console.log(res)
            console.log(status)
            const respuesta = JSON.parse(res.responseText);
            mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);

        }
    })


        /*llena el select de comidas */
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/comidas',
            contentType: 'application/json',
            type: 'GET',
            success: function(res, status, xhr) {
                res.data.map(function(comida) {
                    let option = $(`<option value="${comida.id_comida}">${comida.nombre}</option>`)
                    $('#selComidas').append(option);
                })
            },
            error: function(res, status, xhr) {
                console.log(res)
                console.log(status)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    
            }
        })
    
        /* llena el select de los grupos alimenticios */
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/grupoalimenticios',
            contentType: 'application/json',
            type: 'GET',
            success: function(res, status, xhr) {
                res.data.map(function(grupoAlimenticio) {
                    let option = $(`<option value="${grupoAlimenticio.id_grupo_alimenticio}">${grupoAlimenticio.nombre}</option>`)
                    $('#selGruposAlimenticios').append(option);
                    $('#selGruposAlimenticios').multiSelect('refresh')
                })
            },
            error: function(res, status, xhr) {
                console.log(res)
                console.log(status)
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
    
            }
        })

    //Busqueda del id del el plan de dieta a editar a editar
    var paramstr = window.location.search.substr(1);
    var paramarr = paramstr.split("=");
    var params = {};
    params[paramarr[0]] = paramarr[1];
    const id = params['id'];
    
    //Llena el formulario con informacion del plan de dieta a editar
    if (id != undefined) {
        $('#btnEditar').css('display', 'inline');
        $('#btnAceptar').css('display', 'none');
        $('#configurarComidas').css('display', 'none');
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plandieta/' + id,
            contentType: 'application/json',
            type: 'GET',
            success: function (res, status, xhr) {
                let planDieta = res.data;
                oldPlanDieta = planDieta;
                $('#txtNombreDieta').val(planDieta.nombre);
                $('#txtDescripcion').val(planDieta.descripcion);
                $('#selTipoDieta').val(planDieta.tipo_dieta.id_tipo_dieta);
            },
            error: function (res, status, xhr) {
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta', `${respuesta.data.mensaje}`, 0);
            }
        });
    }

    $('#btnAceptarComida').on('click', function() {
        if($('select[name=comidas]').val() == "0"){
            $('select[name=comidas]').css('border', '1px solid red')
            return;
        }

        if($('select[name=grupoalimenticio]').val() == "0"){
            $('select[name=grupoalimenticio]').css('border', '1px solid red')
            return;
        }

        console.log(valor);
        // Convierte el arreglo de ids en un arreglo de objetos JSON. Ej. { id_ejercicio: id }
        eliminar($('select[name=comidas]').val()); 
        let gruposA = [];
        valor.map(function(val) {
            gruposA.push({
                id_grupo_alimenticio: val,
                nombre: $(`#selGruposAlimenticios option[value="${val}"]`).text()
            })
            arrcomidas.push({
                id_comida: $('select[name=comidas]').val(),
                id_grupo_alimenticio: val
            })
        })

        let comida = [];
        comida.push({
            id_comida: $('select[name=comidas]').val(),
            nombre: $(`#selComidas option[value="${$('select[name=comidas]').val()}"]`).text()
        })

        let Comidas = {
            id_comida: comida,
            id_grupo_alimenticio:  gruposA
        }
        console.log("arreglocomidas: ",arrcomidas);
        idtabla = idtabla + 1;
        addRowComida(Comidas.id_comida, Comidas.id_grupo_alimenticio)
        limpiarAgregarComidas();
        $('#agregarComidas').modal('hide');
        
    })

$('#btnAceptar').on('click', function() {

        if($('#txtNombreDieta').val() == ""){
            $('#txtNombreDieta').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }

        if($('select[name=tipo_dieta]').val() == "0"){
            $('select[name=tipo_dieta]').css('border', '1px solid red')
            return;
        }

        if (tablaComidas.data().count() == 0){
            mensaje('#msjAlerta','', 5);
            return;
        }

        let planDieta = {
            nombre: $('#txtNombreDieta').val(),
            id_tipo_dieta: $('select[name=tipo_dieta]').val(),
            descripcion: $('#txtDescripcion').val(),
            detalle: arrcomidas
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plandietas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planDieta),
            success: function(res, status, xhr) {
                console.log(status);
                verplandieta();
                limpiarPlan();
                mensaje('#msjAlerta', `Plan de Dieta`, 1);
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);
            }
        })

    })

    $('#btnEditar').on('click', function() {

        if($('#txtNombreDieta').val() == ""){
            $('#txtNombreDieta').css('border', '1px solid red');
            return;
        }

        if($('#txtDescripcion').val() == ""){
            $('#txtDescripcion').css('border', '1px solid red');
            return;
        }

        if($('select[name=tipo_dieta]').val() == "0"){
            $('select[name=tipo_dieta]').css('border', '1px solid red')
            return;
        }

        if (tablaComidas.data().count() == 0){
            mensaje('#msjAlerta', 5);
            return;
        }

        let planDieta = {
            nombre: $('#txtNombreDieta').val(),
            id_tipo_dieta: $('select[name=tipo_dieta]').val(),
            descripcion: $('#txtDescripcion').val()
        }

        $.ajax({
            url: `https://api-sascha.herokuapp.com/plandieta/${id}`,
            contentType: 'application/json',
            type: 'PUT',
            data: JSON.stringify(planDieta),
            success: function(res, status, xhr) {
                console.log(status);
                mensaje('#msjAlerta', `Plan de Dieta`, 3);
                verplandieta();
                limpiarPlan();
            },
            error: function(res, status, xhr) {
                console.log(res);
                console.log(status);
                const respuesta = JSON.parse(res.responseText);
                mensaje('#msjAlerta',`${respuesta.data.mensaje}`, 0);

            }
        })

    })

});

function quitarElementosArreglo( arr, item ) {
    arrcomidas = arr.filter( function( e ) {
        return e.id_comida !== item;
    } );
};

function addRowComida(comidas, gruposAlimenticios) {
    comidas.map(function(comida) {
        let row = $(`<tr>
        <td id="comidatabla-${comida.id_comida}">${comida.nombre}</td>
        <td id="gruposAlimenticios-${comida.id_comida}">${gruposAlimenticios.map(function(grupo){
            return grupo.nombre;
        })}</td>
        <td>
        <button onclick="abrirModalEliminar(${comida.id_comida})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarComida" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
        $('#dtComidaGrupo').DataTable().row.add(row).draw();
    })
}

function abrirModalEliminar(id) {
    console.log(id);
    $('#txtIdEliminar').val(id);
}

function eliminar(id) {
    console.log(id);
    quitarElementosArreglo ( arrcomidas, id );
    console.log(arrcomidas);
    $('#dtComidaGrupo').DataTable().row($(`#comidatabla-${id}`).parent()).remove().draw();
}

function limpiarPlan(){
    $('#txtNombreDieta').val('');
    $('#txtDescripcion').val('');
    $('#txtIdPlanDieta').val('');
    $('#txtIdEliminar').val('');
    $('#selTipoDieta option:contains(Seleccione)').prop('selected',true);
    $('#dtComidaGrupo').DataTable().clear();
}

function limpiarAgregarComidas(){
    $('#selComidas option:contains(Seleccione)').prop('selected',true);
    $('#selGruposAlimenticios').multiSelect('deselect_all');
    valor=[];
}

function verplandieta(){
    window.location='conf_plan_dieta.html';
}

