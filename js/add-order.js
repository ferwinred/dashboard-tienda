// add-order.js
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('formulario-pedido');
    if (!form) return;

    // Cargar clientes en select
    const selectCliente = document.getElementById('id_cliente');
    try {
        const res = await fetch('http://localhost:3000/api/clientes');
        const clientes = await res.json();
        clientes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id_cliente;
            opt.textContent = `${c.nombre} ${c.apellido || ''} (${c.email || ''})`;
            selectCliente.appendChild(opt);
        });
    } catch (err) {
        console.error('No se pudieron cargar clientes', err);
    }

    // Cargar productos para seleccionar y agregarlos al carrito
    const resProd = await fetch('http://localhost:3000/api/productos');
    const productos = await resProd.json();

    // Crear un pequeño selector encima de la tabla
    const tablaCarrito = document.getElementById('tabla-carrito');
    const container = tablaCarrito.parentElement;
    const select = document.createElement('select');
    select.className = 'form-control mb-2';
    productos.forEach(p => {
        const o = document.createElement('option');
        o.value = p.id;
        o.textContent = `${p.nombre} - $${p.precio}`;
        select.appendChild(o);
    });
    const btnAgregar = document.createElement('button');
    btnAgregar.className = 'btn btn-sm btn-success mb-2';
    btnAgregar.type = 'button';
    btnAgregar.textContent = 'Agregar producto';
    container.insertBefore(select, tablaCarrito);
    container.insertBefore(btnAgregar, tablaCarrito);

    const carrito = [];

    function renderCarrito() {
        const tbody = tablaCarrito.querySelector('tbody');
        tbody.innerHTML = '';
        carrito.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.precio}</td>
                <td><input type="number" min="1" value="${item.cantidad}" data-id="${item.id_producto}" class="form-control cantidad-input" style="width:80px"></td>
                <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger" data-action="remove" data-id="${item.id_producto}">Quitar</button></td>
            `;
            tbody.appendChild(tr);
        });
        calcularTotal();
    }

    btnAgregar.addEventListener('click', () => {
        const prodId = select.value;
        const prod = productos.find(p => p.id == prodId);
        if (!prod) return;
        const existing = carrito.find(i => i.id_producto == prod.id);
        if (existing) {
            existing.cantidad += 1;
        } else {
            carrito.push({ id_producto: prod.id, nombre: prod.nombre, precio: Number(prod.precio), cantidad: 1 });
        }
        renderCarrito();
    });

    tablaCarrito.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        if (btn.getAttribute('data-action') === 'remove') {
            const idx = carrito.findIndex(i => i.id_producto == id);
            if (idx >= 0) carrito.splice(idx, 1);
            renderCarrito();
        }
    });

    tablaCarrito.addEventListener('change', (e) => {
        const input = e.target.closest('.cantidad-input');
        if (!input) return;
        const id = input.getAttribute('data-id');
        const val = Number(input.value) || 1;
        const item = carrito.find(i => i.id_producto == id);
        if (item) item.cantidad = val;
        renderCarrito();
    });

    function calcularTotal() {
        const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
        const descuento = Number(document.getElementById('descuento').value) || 0;
        const aumento = Number(document.getElementById('aumento').value) || 0;
        const total = subtotal - descuento + aumento;
        document.getElementById('total-pedido').textContent = `$${total.toFixed(2)}`;
        return total;
    }

    // recalcular al cambiar descuento/aumento
    document.getElementById('descuento').addEventListener('input', calcularTotal);
    document.getElementById('aumento').addEventListener('input', calcularTotal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (carrito.length === 0) { alert('Agrega al menos un producto'); return; }
        const id_cliente = selectCliente.value;
        const metodo_pago = document.getElementById('metodo_pago').value;
        const descuento = Number(document.getElementById('descuento').value) || 0;
        const aumento = Number(document.getElementById('aumento').value) || 0;
        const total = calcularTotal();

        const pedido = { id_cliente, metodo_pago, descuento, aumento, total, productos: carrito };

        try {
            const res = await fetch('http://localhost:3000/api/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });
            const data = await res.json();
            if (data && data.id) {
                alert('Pedido creado');
                form.reset();
                carrito.length = 0;
                renderCarrito();
            } else {
                alert('Error en la respuesta del servidor');
            }
        } catch (err) {
            console.error(err);
            alert('Error creando pedido');
        }
    });

});
