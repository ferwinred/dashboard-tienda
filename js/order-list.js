document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabla-pedidos');
    if (!tbody) return;

    let pedidos = [];
    

    try {
        const res = await fetch('http://localhost:3000/api/pedidos');
        pedidos = await res.json();


       pedidos = await Promise.all(pedidos.map(async pedido => {

            const resDetalles = await fetch('http://localhost:3000/api/detalle-pedido?id_pedido=' + pedido.id);

            pedido.detalles = await resDetalles.json();

            return pedido;
        
        }));
    } catch (err) {
        console.error('Error cargando pedidos', err);
        tbody.innerHTML = '<tr><td colspan="7">No se pudo cargar la lista</td></tr>';
        return;
    }

    pedidos.forEach(p => {
        const tr = document.createElement('tr');
        const subtotal = p.detalles ? p.detalles.reduce((sum, d) => sum + (d.precio * d.cantidad), 0) : 0;

        const total = subtotal + Number(p.aumento || 0) - Number(p.descuento || 0);

        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre || p.cliente_nombre || ''}</td>
            <td>${p.email || ''}</td>
            <td>${new Date(p.createdAt || p.fecha || Date.now()).toLocaleString()}</td>
            <td>$${ total?.toFixed(2) }</td>
            <td>${p.estado || 'Pendiente'}</td>
            <td>
              <button class="btn btn-secondary btn-sm id-${p.id}" data-action="toggle">Cambiar Estado</button>
              <button class="btn btn-danger btn-sm id-${p.id}" data-action="delete">Eliminar</button>
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
            if (!confirm('Eliminar pedido?')) return;
            try {
                const res = await fetch('http://localhost:3000/api/pedidos/' + id, { method: 'DELETE' });
                await res.json();
                alert('Pedido eliminado');
                location.reload();
            } catch (err) { console.error(err); alert('Error eliminando pedido'); }
        }

        if (action === 'toggle') {
            // Alternar entre Pendiente -> Enviado -> Entregado
            const pedido = pedidos.find(x => x.id == id);
            if (!pedido) return;
            const estados = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];
            const idx = estados.indexOf(pedido.estado) >= 0 ? estados.indexOf(pedido.estado) : 0;
            const siguiente = estados[(idx + 1) % estados.length];

            try {
                const res = await fetch('http://localhost:3000/api/pedidos/' + id + '/estado', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ estado: siguiente })
                });
                await res.json();
                alert('Estado actualizado a ' + siguiente);
                location.reload();
            } catch (err) { console.error(err); alert('Error actualizando estado'); }
        }
    });
});
