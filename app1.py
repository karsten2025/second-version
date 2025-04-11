import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    # Durchsuche Unterverzeichnisse von static/zertifikate/
    root_dir = "static/zertifikate"
    kategorien = {}

    for ordnername in os.listdir(root_dir):
        ordnerpfad = os.path.join(root_dir, ordnername)
        if os.path.isdir(ordnerpfad):
            dateien = os.listdir(ordnerpfad)
            kategorien[ordnername] = [f"{ordnername}/{datei}" for datei in dateien]

    return render_template("gesamt.html", kategorien=kategorien)

if __name__ == "__main__":
    app.run(debug=True, port=5001)