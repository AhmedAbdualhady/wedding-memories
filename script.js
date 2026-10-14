// ===== Edit your details here =====
const CONFIG = {
names: ["Her Name", "His Name"],
date: "2020-01-01T18:00:00", // wedding date: YYYY-MM-DDTHH:MM:SS
moments: [
    { when: "Where it began", title: "The day we met", text: "I did not know it yet, but my whole life was about to change.", src: "images/photo1.jpg" },
    { when: "A promise", title: "The day we said yes", text: "Two hearts, one decision, and a lifetime ahead of us.", src: "images/photo2.jpg" },
    { when: "Our day", title: "The day we married", text: "Everything I ever hoped for was standing right beside me.", src: "images/photo3.jpg" },
    { when: "Every day since", title: "And still choosing you", text: "Through every season, my favorite place is still next to you.", src: "images/photo4.jpg" }
  ],
letter: `My love,

Thank you for every quiet morning and every loud laugh.

Thank you for staying, for building, and for choosing me again every day.

If I could live it all over, I would find you faster.

Happy Anniversary.`,
closing: "Happy Anniversary, my love"
};

const $ = s => document.querySelector(s);

// ===== Cover =====
const [A, B] = CONFIG.names;
$("#names").innerHTML = `${A}<span class="amp">&amp;</span>${B}`;
$("#initials").textContent = `${Array.from(A)[0]} & ${Array.from(B)[0]}`;
const start = new Date(CONFIG.date);
$("#dateText").textContent = start.toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });

// ===== Time together (updates text only) =====
$("#units").innerHTML = ["Years", "Months", "Days", "Hours", "Minutes", "Seconds"]
  .map(u => `<div class="unit"><b>00</b><small>${u}</small></div>`).join("");
const nums = [...document.querySelectorAll(".unit b")];
function diff(a, b) {
let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate(),
h = b.getHours() - a.getHours(), mi = b.getMinutes() - a.getMinutes(), s = b.getSeconds() - a.getSeconds();
if (s < 0) { s += 60; mi--; }
if (mi < 0) { mi += 60; h--; }
if (h < 0) { h += 24; d--; }
if (d < 0) { d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); m--; }
if (m < 0) { m += 12; y--; }
return [y, m, d, h, mi, s];
}
function tick() {
const now = new Date();
if (document.hidden || start > now) return;
diff(start, now).forEach((v, i) => { nums[i].textContent = String(v).padStart(2, "0"); });
}
setInterval(tick, 1000);
tick();

// ===== Story + letter =====
$("#moments").innerHTML = CONFIG.moments.map(m =>
  `<article class="moment"><figure><img src="${m.src}" alt="" width="800" height="1000" loading="lazy" decoding="async"></figure>
<div class="txt"><p class="when">${m.when}</p><h3 dir="auto">${m.title}</h3><p dir="auto">${m.text}</p></div></article>`
).join("");
$("#letter").innerHTML = CONFIG.letter.split(/\n\s*\n/)
  .map((t, i) => `<p style="--i:${i}" dir="auto">${t}</p>`).join("");

const io = new IntersectionObserver(entries => entries.forEach(e => {
if (!e.isIntersecting) return;
e.target.classList.add("in");
io.unobserve(e.target);
}), { threshold: 0.25 });
document.querySelectorAll(".moment,#letter").forEach(el => io.observe(el));

// ===== Golden bubbles: the loop runs only while bubbles exist =====
const cv = $("#fx"), cx = cv.getContext("2d");
let W, H, ps = [], raf = 0;
function size() {
const d = Math.min(devicePixelRatio || 1, 2);
W = innerWidth; H = innerHeight;
cv.width = W * d; cv.height = H * d;
cx.setTransform(d, 0, 0, d, 0, 0);
}
size();
addEventListener("resize", size);

function bubbles(n) {
for (let i = 0; i < n; i++) ps.push({
x: Math.random() * W, y: H + 10 + Math.random() * H * 0.5,
r: 2 + Math.random() * 5, vy: 1 + Math.random() * 2,
sw: Math.random() * 6, a: 0.3 + Math.random() * 0.6,
c: Math.random() < 0.5 ? "#dcc08a" : "#b88a44"
  });
if (!raf) raf = requestAnimationFrame(loop);
}
function loop() {
cx.clearRect(0, 0, W, H);
ps = ps.filter(p => p.y > -20);
for (const p of ps) {
p.y -= p.vy; p.sw += 0.03; p.x += Math.sin(p.sw) * 0.6;
cx.globalAlpha = p.a;
cx.fillStyle = p.c;
cx.beginPath();
cx.arc(p.x, p.y, p.r, 0, 6.28);
cx.fill();
  }
raf = ps.length ? requestAnimationFrame(loop) : 0;
if (!raf) cx.clearRect(0, 0, W, H);
}

// ===== Finale =====
$("#toast").addEventListener("click", function () {
this.hidden = true;
  $("#closing").textContent = CONFIG.closing;
  $("#closing").classList.add("on");
bubbles(80);
});


