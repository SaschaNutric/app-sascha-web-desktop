$(document).ready(function (event) {
    let empleado = JSON.parse(localStorage.getItem('empleado'));
    console.log(empleado.menu)

    if (!empleado.menu || empleado.menu.length == 0) {
        alert("Disculpa, no tienes acceso a Sascha Intranet")
        window.location.replace('index.html')
    } else {
        let menu = document.createElement('ul');
        menu.className = "sidebar-menu";
        menu.id = "nav-accordion";
        empleado.menu.map(function (item) {
            console.log(item.submenu.length)
            if (item.submenu.length == 0) {
                menu.appendChild(crearItem(item.opcion.icono, item.opcion.nombre, item.opcion.url_vista))
            } else {
                let li_submenu = crearSubmenu(item.opcion.icono, item.opcion.nombre)
                let ul_submenu = document.createElement('ul');
                ul_submenu.className = "sub";
                item.submenu.map(function (opc) {
                    if (!opc.hijos) {
                        ul_submenu.appendChild(crearItem(opc.icono, opc.nombre, opc.url_vista))
                    } else {
                        let sub = crearSubmenu(opc.icono, opc.nombre)
                        let ul_sub = document.createElement('ul');
                        ul_sub.className = "sub"
                        opc.hijos.map(function(ult){
                            ul_sub.appendChild(crearItem(ult.icono,ult.nombre,ult.url_vista))
                        })
                        sub.appendChild(ul_sub)
                        ul_submenu.appendChild(sub)
                    }
                })
                li_submenu.appendChild(ul_submenu)
                menu.appendChild(li_submenu)
            }
        })
       let sidebar= document.getElementById("menu")
       sidebar.appendChild(menu)
    }

    $('span#username').text(empleado.nombres + ' ' + empleado.apellidos);

    $('#btnCerrarSesion').on('click', function (event) {
        localStorage.removeItem('empleado');
        localStorage.removeItem('token');
        window.location = 'index.html';
    })
})

function crearItem(icono, nombre, url) {
    let li_menu = document.createElement('li');
    let li_button = document.createElement('button')
    li_button.className='btn-menu'
    li_button.setAttribute('onclick', `content.location='${url}'`)
    li_button.innerHTML = `<i class="${icono}"></i><span>  ${nombre}</span>`
    li_menu.appendChild(li_button);
    return li_menu;

}

function crearSubmenu(icono, nombre, clase) {
    let li_submenu = document.createElement('li');
    li_submenu.className = "sub-menu";
    let li_a = document.createElement('a');
    li_a.href = "javascript:;";
    li_a.innerHTML = `<i class="${icono}"></i><span>${nombre}</span>`
    li_submenu.appendChild(li_a)
    return li_submenu;
}

function iframe(url){
    document.getElementById('content').location = url;
}