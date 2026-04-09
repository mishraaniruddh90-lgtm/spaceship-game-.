// Scene
const scene = new THREE.Scene();

// 🌌 Stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

const starsVertices = [];
for (let i = 0; i < 5000; i++) {
  starsVertices.push(
    Math.random() * 2000 - 1000,
    Math.random() * 2000 - 1000,
    Math.random() * 2000 - 1000
  );
}
starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
scene.add(new THREE.Points(starsGeometry, starsMaterial));

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.DirectionalLight(0xffffff, 1));
scene.add(new THREE.AmbientLight(0x404040));

// Extra light for clarity
const pointLight = new THREE.PointLight(0x00ffff, 1, 10);
pointLight.position.set(0, 2, 5);
scene.add(pointLight);

// 🚀 SPACESHIP (SMALL + CLEAN)
const ship = new THREE.Group();

// Body
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.6, 3, 32),
  new THREE.MeshStandardMaterial({
    color: 0x99ccff,
    metalness: 0.9,
    roughness: 0.2
  })
);
body.rotation.z = Math.PI / 2;
ship.add(body);

// Nose
const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.4, 1, 32),
  new THREE.MeshStandardMaterial({ color: 0x00ccff })
);
nose.position.x = 2;
nose.rotation.z = Math.PI / 2;
ship.add(nose);

// Cockpit
const cockpit = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x66ffff,
    transparent: true,
    opacity: 0.5,
    metalness: 0.5,
    roughness: 0.1
  })
);
cockpit.position.set(1.2, 0.3, 0);
ship.add(cockpit);

// Wings (thin)
const wing = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 0.05, 0.6),
  new THREE.MeshStandardMaterial({ color: 0x2222ff })
);
wing.position.set(0, -0.3, 0);
ship.add(wing);

const wing2 = wing.clone();
wing2.position.set(0, 0.3, 0);
ship.add(wing2);

// Engine
const engine = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.4, 1, 32),
  new THREE.MeshStandardMaterial({
    color: 0xff6600,
    emissive: 0xff2200,
    emissiveIntensity: 1
  })
);
engine.position.x = -2;
engine.rotation.z = Math.PI / 2;
ship.add(engine);

// Flame
const flame = new THREE.Mesh(
  new THREE.ConeGeometry(0.3, 1, 32),
  new THREE.MeshBasicMaterial({ color: 0xff3300 })
);
flame.position.x = -2.8;
flame.rotation.z = -Math.PI / 2;
ship.add(flame);

// Add ship
ship.position.y = 0.5;
ship.scale.set(0.5, 0.5, 0.5); // 🔥 SMALLER SIZE
scene.add(ship);

// Controls
let moveLeft = false;
let moveRight = false;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Meteors
let meteors = [];

function createMeteor() {
  const meteor = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x884422 })
  );

  meteor.position.set(Math.random() * 10 - 5, 0.5, -40);
  scene.add(meteor);
  meteors.push(meteor);
}

setInterval(createMeteor, 800);

// UI
let score = 0;

const scoreDiv = document.createElement("div");
scoreDiv.style.position = "absolute";
scoreDiv.style.top = "10px";
scoreDiv.style.left = "10px";
scoreDiv.style.color = "white";
scoreDiv.style.fontSize = "24px";
document.body.appendChild(scoreDiv);

const gameOverDiv = document.createElement("div");
gameOverDiv.style.position = "absolute";
gameOverDiv.style.top = "50%";
gameOverDiv.style.left = "50%";
gameOverDiv.style.transform = "translate(-50%, -50%)";
gameOverDiv.style.color = "white";
gameOverDiv.style.fontSize = "40px";
gameOverDiv.style.display = "none";
document.body.appendChild(gameOverDiv);

// Speed
let speed = 0.3;

// Animation
function animate() {
  requestAnimationFrame(animate);

  if (gameOver) return;

  // Movement
  if (moveLeft) ship.position.x -= 0.2;
  if (moveRight) ship.position.x += 0.2;

  // Floating
  ship.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.1;

  // Flame animation
  flame.scale.y = 1 + Math.random() * 0.5;

  // Meteors
  meteors.forEach((m) => {
    m.position.z += speed;

    if (
      Math.abs(m.position.x - ship.position.x) < 1 &&
      Math.abs(m.position.z - ship.position.z) < 1
    ) {
      gameOver = true;
      gameOverDiv.innerHTML = "🚀 GAME OVER<br>Score: " + score;
      gameOverDiv.style.display = "block";
    }
  });

  // Camera follow
  camera.position.x = ship.position.x;

  // Score
  score++;
  scoreDiv.innerHTML = "Score: " + score;

  renderer.render(scene, camera);
}

animate();