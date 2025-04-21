from flask import Flask, render_template, send_from_directory, jsonify, request
import os

app = Flask(__name__)

# Route für die Hauptseite
@app.route("/")
def index():
    return render_template("index.html")

# Route zum Laden von Profil-Teilansichten (Partials)
@app.route("/partials/<partial_name>")
def load_partial(partial_name):
    safe_name = partial_name.replace("..", "").replace("/", "")
    path = os.path.join("templates", "partials", safe_name)
    if os.path.exists(path):
        with open(path, encoding='utf-8') as file:
            return file.read()
    return f"<!-- Partial {partial_name} not found -->", 404

# Route für Zertifikatsdateien (rechte Navigation bleibt erhalten)
@app.route("/certificates/<category>")
def list_certificates(category):
    dir_path = os.path.join("static", "certificates", category)
    if os.path.isdir(dir_path):
        files = sorted(os.listdir(dir_path), reverse=True)
        return jsonify(files)
    return jsonify([])

if __name__ == "__main__":
    app.run(debug=True, port=5001)