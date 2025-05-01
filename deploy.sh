# Zum Projektordner wechseln
cd ~/Documents/Webseiten/PythonProject/second-version || {
  echo "Projektverzeichnis nicht gefunden!";
  exit 1;
}

# Git initialisieren (falls nicht bereits vorhanden)
if [ ! -d ".git" ]; then
  git init
fi

# Remote-URL setzen (nur einmal nötig, ggf. anpassen)
git remote remove origin 2> /dev/null
git remote add origin https://github.com/karsten2025/second-version.git

# Änderungen erfassen und pushen
git add .
git commit -m "Update: Inhalte von second-version"
git branch -M main
git push -u origin main
