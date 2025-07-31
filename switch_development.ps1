# Einführungsnachricht
Write-Output "Ueberpruefen und Aktualisieren der Umgebungsvariablen fuer Backend und Frontend..."
Write-Output "--------------------------------------------------"

# Skript für das Verzeichnis 01_backend\aasservice\src\main\resources

# Verzeichnis und Dateipfade für Backend
$backendDirectory = ".\01_backend\aasservice\src\main\resources"
$backendLocalPropertiesPath = Join-Path $backendDirectory "application-local.properties"
$backendDeployPropertiesPath = Join-Path $backendDirectory "application-deploy.properties"
$backendMainPropertiesPath = Join-Path $backendDirectory "application.properties"

# Funktion zum Vergleichen des Inhalts von zwei Dateien (Backend)
function Compare-BackendFileContent {
    param (
        [string]$file1,
        [string]$file2
    )
    $content1 = Get-Content $file1 -Raw
    $content2 = Get-Content $file2 -Raw
    return ($content1 -eq $content2)
}

# Überprüfen und aktualisieren von application.properties (Backend)
if (Compare-BackendFileContent -file1 $backendMainPropertiesPath -file2 $backendLocalPropertiesPath) {
    Copy-Item $backendDeployPropertiesPath $backendMainPropertiesPath -Force
    Write-Output "Backend application.properties: Lokal -> Deploy."
}
elseif (Compare-BackendFileContent -file1 $backendMainPropertiesPath -file2 $backendDeployPropertiesPath) {
    Copy-Item $backendLocalPropertiesPath $backendMainPropertiesPath -Force
    Write-Output "Backend application.properties: Deploy -> Lokal."
}
else {
    Write-Output "Der Inhalt von application.properties stimmt weder mit application-local.properties noch mit application-deploy.properties überein."
}

# Leerzeile zur Trennung der Abschnitte
Write-Output ""
Write-Output "--------------------------------------------------"
Write-Output ""

# Skript für das Verzeichnis 02_frontend\app\

# Verzeichnis und Dateipfade für Frontend
$frontendDirectory = ".\02_frontend\app\"
$frontendLocalEnvPath = Join-Path $frontendDirectory ".env-local"
$frontendDeployEnvPath = Join-Path $frontendDirectory ".env-deploy"
$frontendMainEnvPath = Join-Path $frontendDirectory ".env"

# Funktion zum Vergleichen des Inhalts von zwei Dateien (Frontend)
function Compare-FrontendFileContent {
    param (
        [string]$file1,
        [string]$file2
    )
    $content1 = Get-Content $file1 -Raw
    $content2 = Get-Content $file2 -Raw
    return ($content1 -eq $content2)
}

# Überprüfen und aktualisieren von .env (Frontend)
if (Compare-FrontendFileContent -file1 $frontendMainEnvPath -file2 $frontendLocalEnvPath) {
    Copy-Item $frontendDeployEnvPath $frontendMainEnvPath -Force
    Write-Output "Frontend .env-Datei: Lokal -> Deploy."
}
elseif (Compare-FrontendFileContent -file1 $frontendMainEnvPath -file2 $frontendDeployEnvPath) {
    Copy-Item $frontendLocalEnvPath $frontendMainEnvPath -Force
    Write-Output "Frontend .env-Datei: Deploy -> Lokal."
}
else {
    Write-Output "Der Inhalt von .env stimmt weder mit .env-local noch mit .env-deploy überein."
}
