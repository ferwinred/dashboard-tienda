document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;

    let usuarios = [];
    try {
        const res = await fetch('http://localhost:3000/api/usuarios');
        usuarios = await res.json();
    } catch (err) {
        console.error('Error cargando usuarios', err);
        tbody.innerHTML = '<tr><td colspan="5">No se pudo cargar la lista</td></tr>';
        return;
    }

    usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.usuario}</td>
            <td>${u.rol}</td>
            <td>${new Date(u.createdAt || Date.now()).toLocaleString()}</td>
            <td>
              <button class="btn btn-primary btn-sm id-${u.id}" data-action="edit">Editar</button>
              <button class="btn btn-danger btn-sm id-${u.id}" data-action="delete">Eliminar</button>
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
            if (!confirm('Eliminar usuario?')) return;
            try {
                const res = await fetch('http://localhost:3000/api/usuarios/' + id, { method: 'DELETE' });
                await res.json();
                alert('Usuario eliminado');
                location.reload();
            } catch (err) { console.error(err); alert('Error eliminando usuario'); }
        }

        if (action === 'edit') {
            const usuario = usuarios.find(x => x.id == id);
            if (!usuario) return;
            const nuevoRol = prompt('Rol', usuario.rol) || usuario.rol;
            try {
                const res = await fetch('http://localhost:3000/api/usuarios/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...usuario, rol: nuevoRol })
                });
                await res.json();
                alert('Usuario actualizado');
                location.reload();
            } catch (err) { console.error(err); alert('Error actualizando usuario'); }
        }
    });
});
