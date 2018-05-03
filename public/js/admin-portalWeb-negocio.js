var TablaRedesSociales = function () {

    return {

        //main function to initiate the module
        init: function () {


            var oTable = $('#redes-sociales').dataTable({
                
                // set the initial value
                "sDom": "ftp",

                "sPaginationType": "bootstrap",
                "oLanguage": {

                    "sSearch": "Buscar",
                    "oPaginate": {
                        "sPrevious": "Anterior",
                        "sNext": "Proximo"
                    }
                },
                "aoColumnDefs": [{
                        'bSortable': false,
                        'aTargets': [0]
                    }
                ]
            });

            jQuery('#redes-sociales_wrapper .dataTables_filter input').addClass("form-control medium"); // modify table search input
            jQuery('#redes-sociales_wrapper .dataTables_length select').addClass("form-control xsmall"); // modify table per page dropdown

            var nEditing = null;

           

        }

    };

}();