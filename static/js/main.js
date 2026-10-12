const PHONE_NUMBER = "51921576861";
let menuData = {};
let cart = [];

const CATEGORY_ORDER = [
    { key: "brasas", title: "Brasas" },
    { key: "alitas", title: "Alitas" },
    { key: "broaster", title: "Broaster" },
    { key: "a_la_carta", title: "A la Carta" },
    { key: "burguers", title: "Burguers" }
];

document.addEventListener('DOMContentLoaded', () => {
    initTabsNav();
    fetchMenuData();
    setupCartListeners();
    checkStoreSchedule();
});

function checkStoreSchedule() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Horario: 8:30 a.m. (510 min) a 11:00 p.m. (1380 min)
    const openTime = 8 * 60 + 30;
    const closeTime = 23 * 60;

    const badge = document.getElementById('storeStatusBadge');
    const statusText = document.getElementById('statusText');

    const isOpen = currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime;

    if (isOpen) {
        badge.className = "status-indicator open";
        statusText.innerText = "Abierto ahora (Atendemos hasta las 11:00 p.m.)";
    } else {
        badge.className = "status-indicator closed";
        statusText.innerText = "Cerrado (Abre a las 8:30 a.m.)";
    }
}

function initTabsNav() {
    document.querySelectorAll('.tab-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`sec-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

function fetchMenuData() {
    fetch('/api/productos')
        .then(res => res.json())
        .then(data => {
            menuData = data;
            renderCategoryItems('todos');
            setupFilterChips();
        });
}

function setupFilterChips() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderCategoryItems(chip.dataset.cat);
        });
    });
}

function renderCategoryItems(cat) {
    const container = document.getElementById('menuList');
    container.innerHTML = '';

    if (cat === 'todos') {
        CATEGORY_ORDER.forEach(catObj => {
            if (menuData[catObj.key] && menuData[catObj.key].length > 0) {
                const header = document.createElement('div');
                header.className = 'menu-section-header';
                header.innerHTML = `<i class="fa-solid fa-fire"></i> ${catObj.title}`;
                container.appendChild(header);

                const subContainer = document.createElement('div');
                subContainer.className = 'menu-list-container';
                
                menuData[catObj.key].forEach(item => {
                    subContainer.appendChild(createItemRow(item));
                });
                container.appendChild(subContainer);
            }
        });
    } else if (menuData[cat]) {
        const subContainer = document.createElement('div');
        subContainer.className = 'menu-list-container';

        menuData[cat].forEach(item => {
            subContainer.appendChild(createItemRow(item));
        });
        container.appendChild(subContainer);
    }
}

function createItemRow(item) {
    const row = document.createElement('div');
    row.className = 'menu-item-row';
    
    const descHtml = item.desc ? `<p>${item.desc}</p>` : '';

    row.innerHTML = `
        <div class="menu-item-left">
            <div class="item-details">
                <h4>${item.nombre}</h4>
                ${descHtml}
            </div>
        </div>
        <div class="item-actions">
            <span class="price-tag">S/ ${item.precio.toFixed(2)}</span>
            <button class="btn-add-circle" onclick="addToCart('${item.id}', '${item.nombre}', ${item.precio})">+ Agregar</button>
        </div>
    `;
    return row;
}

function addToCart(id, nombre, precio) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, nombre, precio, qty: 1 });
    }
    updateTopCartBadge();
    showToast();
}

function showToast() {
    const toast = document.getElementById('toastNotification');
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2000);
}

function updateTopCartBadge() {
    const badge = document.getElementById('topCartBadge');
    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);

    if (totalCount > 0) {
        badge.classList.remove('hidden');
        badge.innerText = totalCount;
    } else {
        badge.classList.add('hidden');
        closeCartDrawer();
    }
}

function setupCartListeners() {
    const openBtn = document.getElementById('openCartTopBtn');
    const closeBtn = document.getElementById('closeCartBtn');
    const backdrop = document.getElementById('cartOverlay');

    openBtn.addEventListener('click', openCartDrawer);
    closeBtn.addEventListener('click', closeCartDrawer);
    backdrop.addEventListener('click', closeCartDrawer);

    document.getElementById('submitOrderBtn').addEventListener('click', sendOrderWA);
}

function openCartDrawer() {
    renderCartDrawerContent();
    document.getElementById('cartDrawer').classList.remove('closed');
    document.getElementById('cartOverlay').classList.remove('hidden');
}

function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.add('closed');
    document.getElementById('cartOverlay').classList.add('hidden');
}

function renderCartDrawerContent() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const sub = item.precio * item.qty;
        total += sub;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                <small style="color:#666">S/ ${item.precio.toFixed(2)} c/u</small>
            </div>
            <div class="qty-controls">
                <button class="btn-qty" onclick="changeQty('${item.id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn-qty" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
        `;
        container.appendChild(row);
    });

    document.getElementById('modalTotalAmount').innerText = `S/ ${total.toFixed(2)}`;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateTopCartBadge();
    renderCartDrawerContent();
}

function sendOrderWA() {
    if (cart.length === 0) return;

    const detail = document.getElementById('deliveryDetail').value.trim() || 'Para llevar';
    const payment = document.getElementById('paymentDetail').value;

    let text = `🍗 *NUEVO PEDIDO - SABOR & SAZÓN*\n`;
    text += `----------------------------------\n`;

    let total = 0;
    cart.forEach(item => {
        const sub = item.precio * item.qty;
        total += sub;
        text += `• ${item.qty}x ${item.nombre} (S/ ${sub.toFixed(2)})\n`;
    });

    text += `----------------------------------\n`;
    text += `*Total:* S/ ${total.toFixed(2)}\n`;
    text += `*Modalidad:* ${detail}\n`;
    text += `*Método de Pago:* ${payment}\n`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}