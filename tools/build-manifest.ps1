# Generates manifest.json for the ai-lab content repository.
#
# The repository layout is <model>/<task>/, and each work carries a meta.json
# describing its harness, provider, environment, grade and deliverables. This
# script reads those meta files and emits the flat manifest the showcase site
# consumes, re-checking a few facts against the files on disk so the manifest
# cannot drift from reality.
$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = (Get-Location).Path

function Get-Kind([string]$dir) {
  $files = Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\_build\\|\\tools\\' }
  $exts = $files | ForEach-Object { $_.Extension.ToLower() } | Sort-Object -Unique
  $hasHtml = $files | Where-Object { $_.Name -match '^(index|render|watch)\.html$' }
  $kinds = @()
  if ($hasHtml) { $kinds += 'interactive' }
  # Videos are published externally; a local copy would be an untracked leftover.
  if ($exts -contains '.mp4' -or $exts -contains '.webm') { $kinds += 'video-present' }
  if ($kinds.Count -eq 0) { $kinds += 'assets' }
  return ($kinds -join '+')
}

function Get-Entry([string]$dir) {
  $cands = @('index.html','render.html','watch.html','src/index.html','mv/index.html','output/watch.html','output/v2/watch.html')
  foreach ($c in $cands) {
    if (Test-Path -LiteralPath (Join-Path $dir $c)) { return $c }
  }
  return $null
}

function Get-Cover([string]$dir) {
  $cands = @(
    'preview/01-hero.png','output/cover.jpg','output/cover_4x3.jpg','cover.jpg','output/cover.png',
    'preview/02-overview.png','preview_03s.png'
  )
  foreach ($c in $cands) {
    if (Test-Path -LiteralPath (Join-Path $dir $c)) { return $c }
  }
  # Fall back to the first screenshot-like image that is part of the shipped
  # work. Internal working directories are excluded: an image under _dev/ or
  # tools/ is build scaffolding, not something to surface as a cover.
  $img = Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Extension -match '^\.(png|jpg|jpeg)$' -and
      $_.FullName -notmatch '\\node_modules\\|\\_build\\|\\tools\\|\\_dev\\'
    } |
    Select-Object -First 1
  if ($img) { return $img.FullName.Substring($dir.Length + 1).Replace('\','/') }
  return $null
}

$entries = @()
$missingMeta = @()

Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -notin @('.git','prompts','tools','.github','.agents') } |
  ForEach-Object {
    $model = $_
    Get-ChildItem -LiteralPath $model.FullName -Directory | ForEach-Object {
      $task = $_
      $rel = $task.FullName.Substring($root.Length + 1).Replace('\','/')
      $metaPath = Join-Path $task.FullName 'meta.json'

      if (-not (Test-Path -LiteralPath $metaPath)) {
        # Not a work directory (e.g. a shared asset folder): skip, but report.
        $missingMeta += $rel
        return
      }

      $meta = Get-Content -LiteralPath $metaPath -Raw -Encoding UTF8 | ConvertFrom-Json

      $entries += [ordered]@{
        id       = ($rel -replace '[^A-Za-z0-9]+','-').Trim('-').ToLower()
        model    = $meta.model
        tool     = $meta.harness
        harness  = $meta.harness
        provider = $meta.provider
        task     = $meta.task
        path     = $rel
        # Re-derived from disk so the manifest reflects what is actually shipped.
        kind     = Get-Kind $task.FullName
        entry    = Get-Entry $task.FullName
        cover    = Get-Cover $task.FullName
        grade    = $meta.grade
        attempts = $meta.attempts
        date     = $meta.date
        prompt   = $meta.prompt
        hasDoc   = (Test-Path -LiteralPath (Join-Path $task.FullName 'README.md'))
        videoUrl = $meta.deliverables.videoUrl
      }
    }
  }

$manifest = [ordered]@{
  schema    = 2
  generated = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
  source    = 'https://github.com/l4place0/ai-lab'
  count     = $entries.Count
  items     = $entries
}

$json = $manifest | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText((Join-Path $root 'manifest.json'), $json, (New-Object System.Text.UTF8Encoding($false)))

Write-Output "wrote manifest.json with $($entries.Count) items"
Write-Output "=== grade coverage ==="
$graded = $entries | Where-Object { $_.grade }
Write-Output "graded: $($graded.Count) / $($entries.Count)"
$entries | Where-Object { $_.grade } | ForEach-Object { "  $($_.grade.PadRight(6)) $($_.path)" }
Write-Output "=== provider breakdown ==="
$entries | Group-Object { $_.provider.kind } | ForEach-Object { "  $($_.Count)  $($_.Name)" }
Write-Output "=== kind breakdown ==="
$entries | Group-Object kind | ForEach-Object { "  $($_.Count)  $($_.Name)" }
if ($missingMeta.Count) {
  Write-Output "=== directories without meta.json (skipped) ==="
  $missingMeta | ForEach-Object { "  $_" }
}
