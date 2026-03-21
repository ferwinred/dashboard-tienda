const formUsuario = document.getElementById('formulario-usuario');
if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rol = document.getElementById('rol').value;
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        const confirmar = document.getElementById('confirmar_contrasena').value;

        if (contrasena !== confirmar) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol, usuario, contrasena })
            });
            const data = await res.json();
            if (data && data.id) {
                alert('Usuario creado');
                formUsuario.reset();
            } else {
                alert('Respuesta inesperada del servidor');
            }
        } catch (err) {
            console.error(err);
            alert('Error creando usuario');
        }
    });
}
