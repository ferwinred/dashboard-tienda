// add-client.js
const formCliente = document.getElementById('formulario-cliente');

if (formCliente) {
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre-cli').value.trim();
        const apellido = document.getElementById('apellido-cli').value.trim();
        const email = document.getElementById('email-cli').value.trim();
        const celular = document.getElementById('celular-cli').value.trim();
        const direccion = document.getElementById('direccion-cli').value.trim();
        const direccion2 = document.getElementById('direccion2-cli').value.trim();
        const descripcion = document.getElementById('descripcion-cli').value.trim();

        try {
            const res = await fetch('http://localhost:3000/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, email, celular, direccion, direccion2, descripcion })
            });

            const data = await res.json();
            if (data && data.id) {
                alert('Cliente creado con éxito');
                formCliente.reset();
            } else {
                alert('Respuesta inesperada del servidor');
            }
        } catch (err) {
            console.error(err);
            alert('Error creando cliente');
        }
    });
}
