function reloadActiveOrders() { orders.obtainActiveOrders(); }

const mM700 = window.matchMedia("(min-width: 700px)");
const mM800 = window.matchMedia("(min-width: 800px)");
const mM1400 = window.matchMedia("(min-width: 1400px)");
const mM1600 = window.matchMedia("(min-width: 1600px)");

mM700.addEventListener('change', reloadActiveOrders);
mM800.addEventListener('change', reloadActiveOrders);
mM1400.addEventListener('change', reloadActiveOrders);
mM1600.addEventListener('change', reloadActiveOrders);