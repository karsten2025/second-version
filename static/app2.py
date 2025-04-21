from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def startseite():
    return render_template("gesamt2.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)

