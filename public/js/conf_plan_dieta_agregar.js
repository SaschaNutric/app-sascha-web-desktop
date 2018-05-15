let grupos=[];
let arreglocomidas=[];
let arrcomidas=[];
let valor=[];
let idtabla = 0;
$(document).ready(function() {
    $('#dtComidaGrupo').DataTable( {
        "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 2 ] }
        ],
        "language": {
        "lengthMenu": "",
        "paginate": {
            "previous": "Anterior",
            "next": "Siguiente"
        },
        "emptyTable": "No se encontraron comidas",
        "zeroRecords": "No se encontraron comidas"
        },
        "searching": false,
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
            console.log(res);
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
                console.log(res);
                res.data.map(function(comida) {
                    arreglocomidas.push(comida);
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
                console.log(res);
                res.data.map(function(grupoAlimenticio) {
                    grupos.push(grupoAlimenticio);
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
        $('#btnGuardar').css('display', 'inline');
        $('#btnRegistrar').css('display', 'none');
        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plandieta/' + id,
            contentType: 'application/json',
            type: 'GET',
            success: function (res, status, xhr) {
                console.log(res.data);
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
        let gruposA = [];
        valor.map(function(val) {
            gruposA.push({
                id_grupo_alimenticio: val,
                nombre: $(`#selGruposAlimenticios option[value="${val}"]`).text()
            })
        })

        let comida = [];
        comida.push({
            id_comida: $('select[name=comidas]').val(),
            nombre: $(`#selComidas option[value="${$('select[name=comidas]').val()}"]`).text()
        })

        idtabla = idtabla + 1;
        let Comidas = {
            id_comida: comida,
            id_grupo_alimenticio:  gruposA
        }
        console.log(Comidas);
        addRowComida(idtabla,Comidas.id_comida, Comidas.id_grupo_alimenticio)
        arrcomidas.push(Comidas);
        console.log("arreglocomidas: ",arrcomidas);
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


        let planDieta = {
            nombre: $('#txtNombreDieta').val(),
            id_tipo_dieta: $('select[name=tipo_dieta]').val(),
            descripcion: $('#txtDescripcion').val(),
        }

        $.ajax({
            url: 'https://api-sascha.herokuapp.com/plandietas',
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(planDieta),
            success: function(res, status, xhr) {
                console.log(res);
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


});

function addRowComida(id,comida, gruposAlimenticios) {
    let row = $(`<tr>
        <td id="comida"-${id}>${comida.map(function(comida){
            return comida.nombre;
        })}</td>
        <td id="gruposAlimenticios"-${id}>${gruposAlimenticios.map(function(grupo){
            return grupo.nombre;
        })}</td>
        <td>
        <button onclick="abrirModalEliminar(${id})" type='button' class='ver btn  btn-transparente' data-toggle='modal' data-target="#eliminarComida" title='Eliminar'><i class="fa fa-trash-o"></i></button>
        </td>
        </tr>
        `);
    $('#dtComidaGrupo').DataTable().row.add(row).draw();
}

function abrirModalEliminar(id) {
    $('#txtIdEliminar').val(id);
}

function eliminar(id) {
    $('#dtComidaGrupo').DataTable().row($(`#comida-${id}`).parent()).remove().draw();       
}

function limpiarPlan(){
    $('#txtNombreDieta').val('');
    $('#txtDescripcion').val('');
    $('#txtIdPlanDieta').val('');
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

