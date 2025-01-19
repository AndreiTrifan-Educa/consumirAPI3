const contenedorBlog = document.getElementById('contenedor');

async function cargarPublicaciones() {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts');
    const publicaciones = await respuesta.json();
    renderizarPublicaciones(publicaciones);
}

async function cargarUsuarios(idUsuario) {
    const respuesta = await fetch(`https://jsonplaceholder.typicode.com/users/${idUsuario}`);
    const usuario = await respuesta.json();
    return usuario;
}

function generarColorFondo() {
    const r = Math.floor(Math.random() * 101) + 50;
    const g = Math.floor(Math.random() * 101) + 50;
    const b = Math.floor(Math.random() * 101) + 50;
    return `rgb(${r}, ${g}, ${b})`;
}

function renderizarPublicaciones(publicaciones) {
    contenedorBlog.innerHTML = '';
    publicaciones.forEach(publicacion => {
        const cuerpoPub = document.createElement('div');
        cuerpoPub.classList.add('publicacion');

        const contUsuario = document.createElement('div');
        contUsuario.classList.add('contUsuario');
    
        cargarUsuarios(publicacion.userId).then(usuario => {
            const imgUsuario = document.createElement('div');
            const colorFondo = generarColorFondo();
            imgUsuario.style.backgroundColor = colorFondo;
            imgUsuario.classList.add('imgUsuario');
            imgUsuario.style.cursor = 'pointer';

            imgUsuario.addEventListener('click', () => mostrarPerfilUsuario(usuario));

            const username = document.createElement('h4');
            username.textContent = usuario.username;
            const letraUsuario = document.createElement('span');
            letraUsuario.textContent = username.textContent.charAt(0);
            imgUsuario.appendChild(letraUsuario);
            contUsuario.appendChild(imgUsuario);
            contUsuario.appendChild(username);
            username.style.cursor = 'pointer';

            username.addEventListener('click', () => mostrarPerfilUsuario(usuario));
        });

        const titulo = document.createElement('h2');
        titulo.textContent = publicacion.title;

        const contenido = document.createElement('p');
        contenido.textContent = publicacion.body;

        const botonComentarios = document.createElement('button');
        botonComentarios.textContent = 'Mostrar comentarios';
        botonComentarios.addEventListener('click', () =>
            alternarComentarios(publicacion.id, cuerpoPub, botonComentarios)
        );

        const contenedorComentarios = document.createElement('div');
        contenedorComentarios.classList.add('comentarios', 'hidden');

        cuerpoPub.appendChild(contUsuario);
        cuerpoPub.appendChild(titulo);
        cuerpoPub.appendChild(contenido);
        cuerpoPub.appendChild(botonComentarios);
        cuerpoPub.appendChild(contenedorComentarios);
        contenedorBlog.appendChild(cuerpoPub);
    });
}

//////////////////////////////////////////////////////////////////
function mostrarPerfilUsuario(usuario) {
    contenedorBlog.innerHTML = '';
    const perfil = document.createElement('div');
    perfil.classList.add('perfilUsu');

    const encabezado = document.createElement('h2');
    encabezado.textContent = usuario.username;
    perfil.appendChild(encabezado);

    const detalles = document.createElement('p');
    detalles.innerHTML = `
        <strong>Nombre:</strong> ${usuario.name}<br>
        <strong>Email:</strong> ${usuario.email}<br>
        <strong>Teléfono:</strong> ${usuario.phone}<br>
        <strong>Sitio web:</strong> <a href="http://${usuario.website}" target="_blank">${usuario.website}</a>
    `;
    perfil.appendChild(detalles);

    const albumes = document.createElement('h2');
    albumes.textContent = `Álbumes de ${usuario.username}`;
    perfil.appendChild(albumes);

    const albumList = document.createElement('ul');
    perfil.appendChild(albumList);
    
    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${usuario.id}`).then(response => response.json()).then(albums => {

        if (albums.length > 0) {
            albums.forEach(album => {
                const li = document.createElement('li');
                li.textContent = album.title;
                albumList.appendChild(li);
            });
        } else {
            albumList.textContent = 'No se encontraron álbumes para este usuario.';
            }
        });

    const botonVolver = document.createElement('button');
    botonVolver.textContent = 'Volver a las publicaciones';
    botonVolver.addEventListener('click', cargarPublicaciones);

    perfil.appendChild(botonVolver);
    contenedorBlog.appendChild(perfil);
}
//////////////////////////////////////////////////////////////////////////////////////

async function alternarComentarios(idPublicacion, cuerpoPub, botonComentarios) {
    const contenedorComentarios = cuerpoPub.querySelector('.comentarios');

    if (contenedorComentarios.classList.contains('hidden')) {
        if (contenedorComentarios.childElementCount === 0) {
            const respuesta = await fetch(`https://jsonplaceholder.typicode.com/posts/${idPublicacion}/comments`);
            const comentarios = await respuesta.json();
            renderizarComentarios(comentarios, contenedorComentarios);
        }
        contenedorComentarios.classList.remove('hidden');
        contenedorComentarios.style.display = 'block';
        botonComentarios.textContent = 'Ocultar comentarios';
    } else {
        contenedorComentarios.classList.add('hidden');
        contenedorComentarios.style.display = 'none';
        botonComentarios.textContent = 'Mostrar comentarios';
    }
}

function renderizarComentarios(comentarios, contenedor) {
    contenedor.innerHTML = '';
    comentarios.forEach(comentario => {
        const cuerpoPubComentario = document.createElement('div');
        cuerpoPubComentario.classList.add('comentario');

        const nombre = document.createElement('h4');
        const username = comentario.email.split('@')[0];
        nombre.textContent = username;
        cuerpoPubComentario.appendChild(nombre);

        const contenido = document.createElement('p');
        contenido.textContent = comentario.body;
        cuerpoPubComentario.appendChild(contenido);

        contenedor.appendChild(cuerpoPubComentario);
    });
}

document.addEventListener('DOMContentLoaded', cargarPublicaciones);
