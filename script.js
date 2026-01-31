// Update cart count on page load
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => el.textContent = count);
}

// Initialize cart count
updateCartCount();

// 3D Loading Screen Animation
const loadingCanvas = document.getElementById('loading-canvas');
if (loadingCanvas) {
    const loadingCtx = loadingCanvas.getContext('2d');
    loadingCanvas.width = 200;
    loadingCanvas.height = 200;

    class LoadingShape {
        constructor() {
            this.rotation = 0;
        }

        draw() {
            loadingCtx.clearRect(0, 0, 200, 200);
            loadingCtx.save();
            loadingCtx.translate(100, 100);
            loadingCtx.rotate(this.rotation);

            // Outer octagon
            loadingCtx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 60;
                const y = Math.sin(angle) * 60;
                if (i === 0) loadingCtx.moveTo(x, y);
                else loadingCtx.lineTo(x, y);
            }
            loadingCtx.closePath();
            loadingCtx.strokeStyle = '#7B5CFF';
            loadingCtx.lineWidth = 3;
            loadingCtx.shadowBlur = 20;
            loadingCtx.shadowColor = '#7B5CFF';
            loadingCtx.stroke();

            // Inner octagon
            loadingCtx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 40;
                const y = Math.sin(angle) * 40;
                if (i === 0) loadingCtx.moveTo(x, y);
                else loadingCtx.lineTo(x, y);
            }
            loadingCtx.closePath();
            loadingCtx.strokeStyle = '#B3A7FF';
            loadingCtx.lineWidth = 2;
            loadingCtx.shadowBlur = 15;
            loadingCtx.shadowColor = '#B3A7FF';
            loadingCtx.stroke();

            loadingCtx.restore();
            this.rotation += 0.02;
        }
    }

    const loadingShape = new LoadingShape();
    function animateLoading() {
        loadingShape.draw();
        if (!document.getElementById('loading-screen').classList.contains('hidden')) {
            requestAnimationFrame(animateLoading);
        }
    }
    animateLoading();

    // Progress bar
    let progress = 0;
    const progressBar = document.querySelector('.loading-progress');
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 500);
        }
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 200);
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const speed = 0.3;
        const followerSpeed = 0.08;

        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        followerX += (mouseX - followerX) * followerSpeed;
        followerY += (mouseY - followerY) * followerSpeed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    document.querySelectorAll('a, button, .product-card, .collection-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('active'));
        el.addEventListener('mouseleave', () => follower.classList.remove('active'));
    });
}

// 3D Scene with Three.js
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070B1D, 0.008);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xEAEAFF, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x7B5CFF, 2, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xB3A7FF, 1.5, 100);
    pointLight2.position.set(-20, -20, -10);
    scene.add(pointLight2);

    const spotLight = new THREE.SpotLight(0x7B5CFF, 3);
    spotLight.position.set(0, 30, 20);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    // Massive Particle System (5000 particles)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    const sizesArray = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 200;
        posArray[i + 1] = (Math.random() - 0.5) * 200;
        posArray[i + 2] = (Math.random() - 0.5) * 200;

        // Purple gradient colors
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            colorsArray[i] = 0.48;
            colorsArray[i + 1] = 0.36;
            colorsArray[i + 2] = 1;
        } else if (colorChoice < 0.66) {
            colorsArray[i] = 0.70;
            colorsArray[i + 1] = 0.65;
            colorsArray[i + 2] = 1;
        } else {
            colorsArray[i] = 0.92;
            colorsArray[i + 1] = 0.92;
            colorsArray[i + 2] = 1;
        }

        sizesArray[i / 3] = Math.random() * 0.08 + 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Glowing Geometric Shapes
    const geometries = [];

    // Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(5, 0);
    const icoMat = new THREE.MeshStandardMaterial({
        color: 0x7B5CFF,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: 0x7B5CFF,
        emissiveIntensity: 0.5
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(-15, 0, -20);
    scene.add(icosahedron);
    geometries.push(icosahedron);

    // Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(3, 1, 100, 16);
    const torusMat = new THREE.MeshStandardMaterial({
        color: 0xB3A7FF,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        emissive: 0xB3A7FF,
        emissiveIntensity: 0.3
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(15, -10, -25);
    scene.add(torusKnot);
    geometries.push(torusKnot);

    // Dodecahedron
    const dodecaGeo = new THREE.DodecahedronGeometry(4, 0);
    const dodecaMat = new THREE.MeshStandardMaterial({
        color: 0xEAEAFF,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
        emissive: 0xEAEAFF,
        emissiveIntensity: 0.4
    });
    const dodecahedron = new THREE.Mesh(dodecaGeo, dodecaMat);
    dodecahedron.position.set(0, 15, -30);
    scene.add(dodecahedron);
    geometries.push(dodecahedron);

    // Floating Crystals (50 total)
    const crystals = [];
    for (let i = 0; i < 50; i++) {
        const size = Math.random() * 0.5 + 0.3;
        const crystalGeo = new THREE.OctahedronGeometry(size, 0);
        const crystalMat = new THREE.MeshPhysicalMaterial({
            color: 0x7B5CFF,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.4,
            emissive: 0x7B5CFF,
            emissiveIntensity: 0.2
        });

        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.x = (Math.random() - 0.5) * 80;
        crystal.position.y = (Math.random() - 0.5) * 80;
        crystal.position.z = (Math.random() - 0.5) * 80;

        crystal.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };

        crystals.push(crystal);
        scene.add(crystal);
    }

    camera.position.z = 30;

    // Mouse & Scroll Interaction
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let scrollY = 0;

    document.addEventListener('mousemove', (event) => {
        targetX = (event.clientX / window.innerWidth) * 2 - 1;
        targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // Smooth camera movement
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        camera.position.x = currentX * 6;
        camera.position.y = currentY * 6;
        camera.lookAt(scene.position);

        // Scroll-based depth
        camera.position.z = 30 - scrollY * 0.01;

        // Rotate particles
        particles.rotation.y += 0.0002;
        particles.rotation.x = Math.sin(time * 0.3) * 0.05;

        // Animate geometries
        icosahedron.rotation.x += 0.003;
        icosahedron.rotation.y += 0.005;
        icosahedron.position.y = Math.sin(time) * 3;

        torusKnot.rotation.x += 0.002;
        torusKnot.rotation.y += 0.004;
        torusKnot.position.y = Math.cos(time * 0.8) * 2;

        dodecahedron.rotation.z += 0.004;
        dodecahedron.rotation.y += 0.003;

        // Animate crystals
        crystals.forEach((crystal, index) => {
            crystal.rotation.x += crystal.userData.rotationSpeed.x;
            crystal.rotation.y += crystal.userData.rotationSpeed.y;
            crystal.rotation.z += crystal.userData.rotationSpeed.z;

            crystal.position.y += Math.sin(time * 0.5 + index * 0.1) * 0.01;
            crystal.position.x += Math.cos(time * 0.3 + index * 0.15) * 0.005;
        });

        // Animate lights
        pointLight1.position.x = Math.sin(time * 0.5) * 30;
        pointLight1.position.z = Math.cos(time * 0.5) * 30;

        pointLight2.position.x = Math.cos(time * 0.7) * 25;
        pointLight2.position.z = Math.sin(time * 0.7) * 25;

        spotLight.position.x = Math.sin(time * 0.3) * 20;
        spotLight.position.y = 30 + Math.cos(time * 0.4) * 10;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-header, .product-card, .stat-card, .experience-text, .experience-visual, .cta-content, .collection-card').forEach(el => {
    observer.observe(el);
});

// Filter Functionality (Shop Page)
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('visible');
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Add to Cart Functionality
function addToCart(name, price, category) {
    let cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            category: category,
            quantity: 1
        });
    }
    
    localStorage.setItem('barettaCart', JSON.stringify(cart));
    updateCartCount();
    
    // Visual feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = 'linear-gradient(135deg, #B3A7FF, #7B5CFF)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

// Cart Page Functionality
if (window.location.pathname.includes('cart.html')) {
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
        const cartContainer = document.getElementById('cart-items-container');
        const emptyCart = document.getElementById('empty-cart');
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            updateSummary();
            return;
        }
        
        emptyCart.style.display = 'none';
        
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <div class="item-image">
                        <div style="width:100%;height:100%;background:linear-gradient(135deg, rgba(123, 92, 255, 0.2), rgba(179, 167, 255, 0.1));display:flex;align-items:center;justify-content:center;font-size:48px;">👔</div>
                    </div>
                    <div class="item-details">
                        <div class="item-category">${item.category}</div>
                        <h3>${item.name}</h3>
                        <div class="item-price">$${item.price}</div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;">
                        <div style="font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:#7B5CFF;">$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartContainer.innerHTML = html;
        updateSummary();
    }
    
    function updateQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('barettaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
    
    function removeItem(index) {
        let cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('barettaCart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
    
    function updateSummary() {
        const cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
        document.getElementById('tax').textContent = '$' + tax.toFixed(2);
        document.getElementById('total').textContent = '$' + total.toFixed(2);
    }
    
    function checkout() {
        const cart = JSON.parse(localStorage.getItem('barettaCart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! This is a demo - checkout functionality would be implemented here.');
    }
    
    // Make functions global
    window.updateQuantity = updateQuantity;
    window.removeItem = removeItem;
    window.checkout = checkout;
    
    // Initial render
    renderCart();
}
