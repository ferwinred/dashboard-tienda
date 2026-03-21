document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabla-clientes');
    if (!tbody) return;

    let clientes = [];

    try {
        const res = await fetch('http://localhost:3000/api/clientes');
        clientes = await res.json();
    } catch (err) {
        console.error('Error cargando clientes', err);
        tbody.innerHTML = '<tr><td colspan="7">No se pudo cargar la lista</td></tr>';
        return;
    }

    clientes.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id_cliente}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido || ''}</td>
            <td>${c.email || ''}</td>
            <td>${c.celular || ''}</td>
            <td>${c.direccion || ''}</td>
            <td>
              <button class="btn btn-primary btn-sm id-${c.id_cliente}" data-action="edit">Editar</button>
              <button class="btn btn-danger btn-sm id-${c.id_cliente}" data-action="delete">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const cls = Array.from(btn.classList).find(c => c.startsWith('id-'));
        if (!cls) return;
        const id = cls.split('-')[1];
        const action = btn.getAttribute('data-action');

        if (action === 'delete') {
            const confirmar = confirm('¿Eliminar cliente?');
            if (!confirmar) return;
            try {
                const res = await fetch('http://localhost:3000/api/clientes/' + id, { method: 'DELETE' });
                await res.json();
                alert('Cliente eliminado');
                location.reload();
            } catch (err) {
                console.error(err);
                alert('Error eliminando cliente');
            }
        }

        if (action === 'edit') {
            // Simpl: abrir prompt para editar nombre y email (implementación ligera)
            const cliente = clientes.find(x => x.id_cliente == id);
            if (!cliente) return;
            const nuevoNombre = prompt('Nombre', cliente.nombre) || cliente.nombre;
            const nuevoEmail = prompt('Email', cliente.email || '') || cliente.email;

            try {
                const res = await fetch('http://localhost:3000/api/clientes/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...cliente, nombre: nuevoNombre, email: nuevoEmail })
                });
                await res.json();
                alert('Cliente actualizado');
                location.reload();
            } catch (err) {
                console.error(err);
                alert('Error actualizando cliente');
            }
        }
    });
});
