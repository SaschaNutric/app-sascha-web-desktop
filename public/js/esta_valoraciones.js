
Morris.Bar({
    element: 'graph-bar',
    data: [
        {x: 'Nutricionista', y: 5, z: 9, w: 2},
        {x: 'Plan nutricional', y: 2, z: 3, w: 2},
        {x: 'Plan de suplementos', y: 1, z: 2, w: 2},
        {x: 'Plan de ejercicio', y: 1, z: 2, w: 2},
        {x: 'Duracion del plan', y: 1, z: 2, w: 2}
    ],
    xkey: 'x',
    ykeys: ['y', 'z' , 'w'],
    labels: ['Malo ', 'Regular','Bueno'],
    barColors:['#1c6b34','#7ab740', '#3da3cb'],


});
