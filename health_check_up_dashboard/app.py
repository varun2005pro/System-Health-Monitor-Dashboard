from flask import Flask, render_template, jsonify, request
import psutil
import socket
import time
import subprocess
import ipaddress

app = Flask(__name__)

def get_system_data():
    battery = psutil.sensors_battery()
    battery_percent = battery.percent if battery else "N/A"
    plugged = battery.power_plugged if battery else "N/A"
    secsleft = battery.secsleft if battery else None

    cpu_usage = psutil.cpu_percent(interval=0.5)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    uptime = round((time.time() - psutil.boot_time()) / 60, 1)
    net = psutil.net_io_counters()
    hostname = socket.gethostname()
    try:
        ip_address = socket.gethostbyname(hostname)
    except:
        ip_address = "Unavailable"

    return {
        "battery_percent": battery_percent,
        "plugged": plugged,
        "secsleft": secsleft,
        "cpu_usage": cpu_usage,
        "memory_usage": memory,
        "disk_percent": disk,
        "uptime_minutes": uptime,
        "sent": net.bytes_sent // (1024 * 1024),
        "recv": net.bytes_recv // (1024 * 1024),
        "hostname": hostname,
        "ip_address": ip_address
    }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/data")
def api_data():
    return jsonify(get_system_data())

@app.route("/api/ping", methods=["POST"])
def ping():
    ip = request.json.get("ip")
    if not ip:
        return jsonify({"result": "No IP provided"}), 400

    try:
        import platform
        system = platform.system().lower()
        
        if system == "windows":
            # Windows ping
            command = ["ping", "-n", "1", ip]
        else:
            # Linux/macOS ping
            command = ["ping", "-c", "1", ip]

        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode == 0:
            return jsonify({"result": f"{ip} is reachable ✅"})
        else:
            return jsonify({"result": f"{ip} is not reachable ❌\nDetails: {result.stderr.strip()}"}), 200
    except Exception as e:
        return jsonify({"result": f"Error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=10000)
