
document.addEventListener('DOMContentLoaded', async () => {

    const table = document.getElementById('product-list');
    let selectProduct = null;

    const response = await fetch('http://localhost:3000/api/productos');
    const data = await response.json();

    data.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>${product.precio}</td>
            <td>${product.stock}</td>
            <td> <img src="${product.imagen}" alt="${product.nombre}" width="80" height="80"> </td>
            <td>
              <button class="btn btn-primary btn-sm id-${product.id}" id="edit-product-btn" data-toggle="modal" data-target="#editModal">Editar</button>
              <button class="btn btn-danger btn-sm id-${product.id}" id="delete-product-btn">Eliminar</button>
            </td>
          `;

        table.appendChild(row);


    });

    const btnEliminar = document.getElementById('delete-product-btn');
    const btnEditar = document.getElementById('edit-product-btn');

    btnEliminar.addEventListener('click', (e) => {
        // Lógica para eliminar el producto
        console.log('Eliminar producto');

        const id = e.target.classList[3].split('-')[1];

       const confirmar = confirm('¿Estás seguro de que deseas eliminar este producto?')
           
       if (confirmar) {
                fetch('http://localhost:3000/api/productos/' + id, {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Producto eliminado:', data);
                        alert('Producto eliminado correctamente');
                    })
                    .catch(error => console.error('Error al eliminar el producto:', error));
                } else {
                    e.preventDefault();
                }
        
    });

    btnEditar.addEventListener('click', (e) => {

        const id = e.target.classList[3].split('-')[1];
        const productSelected = data.filter((p) => p.id == id);

        selectProduct = productSelected[0];

    })


    const btnSaveEdit = document.getElementById('btn-save-edit-product');


    btnSaveEdit.addEventListener('click', (e) => {
        // Lógica para guardar los cambios del producto
        console.log('Guardar cambios del producto', e);

        const modal = document.getElementById('editModal');
        const nombreProducto = modal.querySelector('#nombreProducto').value;
        const descripcionProducto = modal.querySelector('#descripcionProducto').value;
        const precioProducto = modal.querySelector('#precioProducto').value;
        const stockProducto = modal.querySelector('#stockProducto').value;
        const imagenProducto = modal.querySelector('#imagenProducto').value;

        fetch('http://localhost:3000/api/productos/' + selectProduct.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombreProducto,
                descripcion: descripcionProducto,
                precio: precioProducto,
                stock: stockProducto,
                imagen: imagenProducto
            })
        })
            .then(response => response.json())
            .then(data => {

                console.log('Producto actualizado:', data);

                alert('Producto actualizado correctamente');
                document.getElementById('btn-close-edit').click();

            })
            .catch(error => console.error('Error al actualizar el producto:', error));

    });
});
