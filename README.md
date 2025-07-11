System Health Monitor Dashboard
A Flask-based web application that monitors and displays your system's health status in real time. It shows live CPU usage, RAM, disk usage, network activity, battery status, and allows pinging other devices on the network (IPv4/IPv6 supported).

netsh advfirewall firewall add rule name="Allow ICMPv4-In" protocol=icmpv4:8,any dir=in action=allow
ipconfig
pip install flask psutil
app.run(debug=True, port=5001)

🔧 Features
📊 Live graphs for:
CPU usage
Memory (RAM) usage
Disk usage
Network (sent/received data)

🔋 Battery monitoring with:
Charging icon that glows when plugged in
Remaining charge time & unplug warning

🌐 Device info:
Hostname and local IP address
📡 Ping any device (IPv4/IPv6) to check reachability
🎨 Clean animated UI with dark theme and responsive layout
🧠 Real-time updates every 3 seconds

🛠️ Built With
Flask – backend framework
psutil – for system stats
Chart.js – to visualize data
HTML, CSS, JS – frontend

📂 Project Structure
csharp
Copy
Edit
📁 your-project/
├── app.py                  # Flask backend
├── requirements.txt        # Dependencies
├── 📁 templates/
│   └── index.html          # UI frontend
├── 📁 static/
│   ├── style.css           # Styling
│   └── scripts.js          # JavaScript (live updates, ping, charts)
