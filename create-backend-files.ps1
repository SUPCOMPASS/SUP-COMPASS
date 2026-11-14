```powershell
# ==========================================
# SUPCOMPASS - Creation des fichiers Backend
# ==========================================

$BackendPath = Join-Path (Get-Location) "backend"

if (!(Test-Path $BackendPath)) {
    Write-Host "Erreur : dossier backend introuvable !" -ForegroundColor Red
    exit
}

$Files = @(
    "src/config/database.ts",

    "src/middleware/error.middleware.ts",

    "src/modules/auth/controllers/auth.controller.ts",
    "src/modules/auth/routes/auth.routes.ts",
    "src/modules/auth/services/auth.service.ts",

    "src/modules/users/controllers/user.controller.ts",
    "src/modules/users/routes/user.routes.ts",
    "src/modules/users/services/user.service.ts",

    "src/types/express.d.ts",

    "src/utils/"

    "src/server.ts"
)

foreach ($File in $Files) {
    $FullPath = Join-Path $BackendPath $File

    if ($File.EndsWith("/")) {
        New-Item -ItemType Directory -Path $FullPath -Force | Out-Null
        continue
    }

    $Parent = Split-Path $FullPath -Parent

    if (!(Test-Path $Parent)) {
        New-Item -ItemType Directory -Path $Parent -Force | Out-Null
    }

    if (!(Test-Path $FullPath)) {
        New-Item -ItemType File -Path $FullPath | Out-Null
        Write-Host "[CREATED] $File" -ForegroundColor Green
    }
    else {
        Write-Host "[EXISTS]  $File" -ForegroundColor Yellow
    }
}

Write-Host "`nCreation terminee !" -ForegroundColor Cyan