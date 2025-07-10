let cpuData = [];
let memoryData = [];
let diskData = [];
let netData = [];

const cpuChart = new Chart(document.getElementById('cpuChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'CPU %', data: cpuData, borderColor: 'red', fill: false }] },
    options: { responsive: true }
});

const memoryChart = new Chart(document.getElementById('memoryChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Memory %', data: memoryData, borderColor: 'blue', fill: false }] },
    options: { responsive: true }
});

const diskChart = new Chart(document.getElementById('diskChart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Disk %', data: diskData, borderColor: 'green', fill: false }] },
    options: { responsive: true }
});

const netChart = new Chart(document.getElementById('netChart'), {
    type: 'line',
    data: { labels: [], datasets: [
        { label: 'Sent MB', data: [], borderColor: 'orange', fill: false },
        { label: 'Recv MB', data: [], borderColor: 'purple', fill: false }
    ]},
    options: { responsive: true }
});

function updateCharts(data) {
    const time = new Date().toLocaleTimeString();
    if (cpuData.length > 10) cpuData.shift();
    if (memoryData.length > 10) memoryData.shift();
    if (diskData.length > 10) diskData.shift();

    cpuData.push(data.cpu_usage);
    memoryData.push(data.memory_usage);
    diskData.push(data.disk_percent);

    cpuChart.data.labels.push(time);
    memoryChart.data.labels.push(time);
    diskChart.data.labels.push(time);
    netChart.data.labels.push(time);

    netChart.data.datasets[0].data.push(data.sent);
    netChart.data.datasets[1].data.push(data.recv);

    cpuChart.update();
    memoryChart.update();
    diskChart.update();
    netChart.update();
}

function fetchData() {
    fetch('/api/data')
    .then(res => res.json())
    .then(data => {
        document.getElementById("host").textContent = data.hostname;
        document.getElementById("ip").textContent = data.ip_address;
        document.getElementById("battery").textContent = `${data.battery_percent}%`;
        document.getElementById("cpu").textContent = `${data.cpu_usage}%`;
        document.getElementById("memory").textContent = `${data.memory_usage}%`;
        document.getElementById("disk").textContent = `${data.disk_percent}%`;

        // Charging logic with glow
        const chargeIcon = document.getElementById("chargeIcon");
        const batteryNote = document.getElementById("batteryNote");

        if (data.plugged === true) {
            chargeIcon.classList.add("glow");  // Add green glow
            batteryNote.textContent = data.battery_percent === 100
                ? "🔋 Battery Full! Unplug Charger"
                : `⚡ Charging... ${Math.floor(data.secsleft / 60)} mins left`;
        } else {
            chargeIcon.classList.remove("glow"); // Remove glow
            batteryNote.textContent = "🔌 Not Charging";
        }

        updateCharts(data);
    });
}


function ping() {
    const ip = document.getElementById("ipInput").value;
    fetch("/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("pingResult").textContent = data.result;
    });
}

setInterval(fetchData, 3000);
if (data.plugged === true) {
    document.getElementById("batteryNote").innerText = "Charging...";
    document.getElementById("chargeIcon").classList.add("glow");
} else {
    document.getElementById("batteryNote").innerText = "Unplugged";
    document.getElementById("chargeIcon").classList.remove("glow");
}
