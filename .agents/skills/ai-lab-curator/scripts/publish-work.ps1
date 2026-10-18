<#
.SYNOPSIS
  Packages, sanitizes, and publishes a benchmark work into the l4place0/ai-lab repository.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$RepoRoot,

  [Parameter(Mandatory = $true)]
  [string]$SourceDir,

  [Parameter(Mandatory = $true)]
  [string]$Model,

  [Parameter(Mandatory = $true)]
  [string]$Task,

  [Parameter(Mandatory = $false)]
  [string]$Grade = $null,

  [Parameter(Mandatory = $false)]
  [string]$Harness = 'antigravity',

  [Parameter(Mandatory = $false)]
  [string]$ProviderKind = 'official',

  [Parameter(Mandatory = $false)]
  [string]$ProviderChannel = $null,

  [Parameter(Mandatory = $false)]
  [string]$PromptRelPath = $null,

  [Parameter(Mandatory = $false)]
  [string]$PromptContent = $null,

  [Parameter(Mandatory = $false)]
  [int]$Attempts = 1,

  [Parameter(Mandatory = $false)]
  [string]$Kept = 'shot01',

  [Parameter(Mandatory = $false)]
  [string]$Entry = 'index.html',

  [Parameter(Mandatory = $false)]
  [string]$VideoUrl = $null,

  [Parameter(Mandatory = $false)]
  [switch]$Push
)

$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$SourceDir = (Resolve-Path -LiteralPath $SourceDir).Path

# 1. Resolve or create initial prompt file in prompts/
if (-not [string]::IsNullOrWhiteSpace($PromptRelPath)) {
  $promptFullPath = Join-Path $RepoRoot ($PromptRelPath -replace '/', '\')
  if (-not (Test-Path -LiteralPath $promptFullPath)) {
    if ([string]::IsNullOrWhiteSpace($PromptContent)) {
      throw "Prompt file '$PromptRelPath' does not exist in repo and -PromptContent was not provided."
    }
    $promptDir = Split-Path -Parent $promptFullPath
    if (-not (Test-Path -LiteralPath $promptDir)) {
      New-Item -ItemType Directory -Force -Path $promptDir | Out-Null
    }
    [System.IO.File]::WriteAllText($promptFullPath, $PromptContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "[1/5] Created missing initial prompt: $PromptRelPath"
  } else {
    Write-Output "[1/5] Found existing initial prompt: $PromptRelPath"
  }
}

# 2. Copy sanitized deliverables to <Model>/<Task>/
$destDir = Join-Path (Join-Path $RepoRoot $Model) $Task
if (-not (Test-Path -LiteralPath $destDir)) {
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

$excludeDirs = @('node_modules', '.git', 'dist', 'build', '_build', '.next', 'coverage', 'tmp', 'temp', 'cache', '.cache', 'logs')
Get-ChildItem -LiteralPath $SourceDir -Force | ForEach-Object {
  if ($_.PSIsContainer) {
    if ($_.Name -in $excludeDirs -or $_.Name -like '.chrome*') { return }
    Copy-Item -LiteralPath $_.FullName -Destination $destDir -Recurse -Force
  } else {
    if ($_.Name -in @('package-lock.json', 'Thumbs.db', '.DS_Store') -or $_.Extension -in @('.log', '.tmp', '.bak', '.mp4', '.webm', '.mov')) { return }
    Copy-Item -LiteralPath $_.FullName -Destination $destDir -Force
  }
}
Write-Output "[2/5] Copied sanitized project files to: $Model/$Task"

# 3. Generate meta.json if not already customized
$metaPath = Join-Path $destDir 'meta.json'
$dateStr = (Get-Date).ToString('yyyy-MM-dd')
$metaObj = [ordered]@{
  '$schema'    = './meta.schema.json'
  model        = $Model
  provider     = [ordered]@{
    kind    = $ProviderKind
    channel = if ([string]::IsNullOrWhiteSpace($ProviderChannel)) { $null } else { $ProviderChannel }
  }
  harness      = $Harness
  task         = $Task
  prompt       = if ([string]::IsNullOrWhiteSpace($PromptRelPath)) { $null } else { $PromptRelPath.Replace('\', '/') }
  date         = $dateStr
  environment  = [ordered]@{
    os  = 'Windows 11 专业版 (build 26300, x64)'
    cpu = 'Intel Core i5-1135G7 (4C/8T @ 2.40GHz)'
    gpu = 'NVIDIA GeForce GTX 1650 Ti 4GB + Intel Iris Xe'
    ram = '16 GB'
  }
  grade        = if ([string]::IsNullOrWhiteSpace($Grade)) { $null } else { $Grade }
  gradeReason  = $null
  attempts     = $Attempts
  kept         = $Kept
  rejected     = @()
  deliverables = [ordered]@{
    kind     = 'interactive'
    entry    = $Entry
    videoUrl = if ([string]::IsNullOrWhiteSpace($VideoUrl)) { $null } else { $VideoUrl }
  }
  reviewNotes  = $null
}

$metaJson = $metaObj | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($metaPath, $metaJson, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "[3/5] Wrote meta.json (grade: $Grade)"

# 4. Rebuild manifest.json
Push-Location $RepoRoot
try {
  & powershell -ExecutionPolicy Bypass -File (Join-Path $RepoRoot 'tools\build-manifest.ps1')
  Write-Output "[4/5] Rebuilt manifest.json"

  # 5. Optional Git commit, push, and site dispatch
  if ($Push) {
    git add .
    $commitMsg = "$Model/$Harness`: add $Task"
    if (-not [string]::IsNullOrWhiteSpace($Grade)) {
      $commitMsg += " (grade $Grade)"
    }
    git commit -m $commitMsg
    git push origin main
    & powershell -ExecutionPolicy Bypass -File (Join-Path $RepoRoot 'tools\notify-site.ps1')
    Write-Output "[5/5] Committed, pushed to origin/main, and ran notify-site.ps1"
  }
}
finally {
  Pop-Location
}
