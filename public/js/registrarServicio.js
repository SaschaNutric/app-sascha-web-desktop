$(document).ready(function() {
let valores = [];

	$('#dtParametros').dataTable( {
		"aoColumnDefs": [
		{ "bSortable": false, "aTargets": [ 4 ] }
		],
		"sDom": "ftp",
		"oLanguage": {
			
			"sLengthMenu": "",
			"sSearch": "Buscar:",
			"oPaginate":{
				"sPrevious": "Anterior",
				"sNext": "Siguiente"
			},
			"sEmptyTable": "No se encontraron parametros"
		},
	} );


	$('#ms_condiciones').multiSelect({
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
            valores.push(values[0]);
            console.log(valores)
        
        },
        afterDeselect: function (values) {
            this.qs1.cache();
            this.qs2.cache();
            const index = valores.indexOf(values[0])
            if(index != -1){
                valores.splice(index,1)
            }
            console.log(valores)

        }
    });

    $('#btnRegistrar').on('click', function() {
let values =[]

       $('#ms_condiciones > option:selected').each(function() {
// this should loop through all the selected elements
    values.push($(this).val())
});
       console.log(values)
   });

   });