# Ausgangsverzeichnis speichern
$originalPath = Get-Location

# Übergeordnetes Verzeichnis ermitteln
$parentPath = Split-Path -Parent $originalPath

# Frontend und Backend Image Namen
$frontendImage = "clicedipp-frontend"
$backendImage = "clicedipp-backend"

# Docker-Images löschen, falls sie existieren
if (docker images -q $frontendImage) {
    docker rmi -f $frontendImage
}

if (docker images -q $backendImage) {
    docker rmi -f $backendImage
}

# Wechsel in das Frontend-Verzeichnis und Docker build ausführen
Set-Location -Path (Join-Path -Path $originalPath -ChildPath "02_frontend\app")
docker build -t $frontendImage .
Start-Sleep -Seconds 2

# Wechsel in das Backend-Verzeichnis und Docker build ausführen
Set-Location -Path (Join-Path -Path $originalPath -ChildPath "01_backend\aasservice")
docker build -t $backendImage .
Start-Sleep -Seconds 2

# Zurück zum Ausgangsverzeichnis wechseln
Set-Location -Path $originalPath

# Docker-Images im übergeordneten Verzeichnis speichern
docker save -o (Join-Path -Path $parentPath -ChildPath "clicedipp-backend.tar") $backendImage
docker save -o (Join-Path -Path $parentPath -ChildPath "clicedipp-frontend.tar") $frontendImage

# Optional: Zurück zum Ausgangsverzeichnis wechseln (falls weitere Schritte folgen)
Set-Location -Path $originalPath