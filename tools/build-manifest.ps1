# Generates manifest.json for the ai-lab content repository.
# Scans every <model>/<tool>/<task>/<shot|revision> leaf, extracts the grade
# from its README, and classifies the deliverable kind from actual files.
$ErrorActionPreference = 'Stop'
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = (Get-Location).Path

# Grade patterns, tried in order. Markdown decoration (**, `, spaces) is
# tolerated between the label, the separator, and the value.
$gradePatterns = @(
  '评级结果\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '最终评级\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '评分等级\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '最终评定\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '验收评定\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '用户评审评定\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '评测得分\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '用户最终评分\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '用户评分\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '综合评定\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '评定\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  '评分\**\s*[：:]\s*[\*`\s]*([SABC])\s*([+-])?',
  'badge/%E8%AF%84%E6%B5%8B%E8%AF%84%E5%AE%9A-([SABC])([+-])?-',
  '明确获评\s*\**([SABC])\s*([+-])?'
)

function Get-Grade([string]$text) {
  if (-not $text) { return $null }
  foreach ($re in $gradePatterns) {
    $m = [regex]::Match($text, $re)
    if ($m.Success) { return ($m.Groups[1].Value + $m.Groups[2].Value) }
  }
  # Failure is stated in prose. Require a verdict context so that a mere
  # mention of the word (e.g. "不合格原因分析") is not read as a grade.
  if ($text -match '(测试判定|评测结论|验收结论|结论|判定|评级|评定|评分)\s*\**\s*[：:]\s*[\*`\s]*不合格' -or
      $text -match '不合格\s*[❌✗]') {
    return '不合格'
  }
  return $null
}

function Get-Kind([string]$dir) {
  $files = Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\|\\_build\\|\\tools\\' }
  $names = $files | ForEach-Object { $_.Name }
  $exts = $files | ForEach-Object { $_.Extension.ToLower() } | Sort-Object -Unique
  $hasHtml = $files | Where-Object { $_.Name -match '^(index|render|watch)\.html$' }
  $kinds = @()
  if ($hasHtml) { $kinds += 'interactive' }
  # Videos are no longer stored; presence would mean a local leftover.
  if ($exts -contains '.mp4' -or $exts -contains '.webm') { $kinds += 'video-present' }
  if ($kinds.Count -eq 0) { $kinds += 'assets' }
  return ($kinds -join '+')
}

# Entry points worth linking/embedding, relative to the shot directory.
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
  # Fall back to the first screenshot-like image found.
  $img = Get-ChildItem -LiteralPath $dir -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Extension -match '^\.(png|jpg|jpeg)$' -and $_.FullName -notmatch '\\node_modules\\|\\_build\\|\\tools\\' } |
    Select-Object -First 1
  if ($img) { return $img.FullName.Substring($dir.Length + 1).Replace('\','/') }
  return $null
}

$entries = @()
Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -notin @('.git','prompts','.github') } |
  ForEach-Object {
    $model = $_
    Get-ChildItem -LiteralPath $model.FullName -Directory | ForEach-Object {
      $tool = $_
      Get-ChildItem -LiteralPath $tool.FullName -Directory |
        Where-Object { $_.Name -notin @('src','_build','node_modules') } | ForEach-Object {
          $task = $_
          $shots = Get-ChildItem -LiteralPath $task.FullName -Directory |
            Where-Object { $_.Name -match '^(shot|revision)\d+$' } | Sort-Object Name
          if (-not $shots) { return }
          foreach ($shot in $shots) {
            $rm = Join-Path $shot.FullName 'README.md'
            $text = if (Test-Path -LiteralPath $rm) { Get-Content -LiteralPath $rm -Raw -Encoding UTF8 } else { '' }
            $rel = $shot.FullName.Substring($root.Length + 1).Replace('\','/')
            $entries += [ordered]@{
              id       = ($rel -replace '[^A-Za-z0-9]+','-').Trim('-').ToLower()
              model    = $model.Name
              tool     = $tool.Name
              task     = $task.Name
              shot     = $shot.Name
              path     = $rel
              kind     = Get-Kind $shot.FullName
              entry    = Get-Entry $shot.FullName
              cover    = Get-Cover $shot.FullName
              grade    = Get-Grade $text
              hasDoc   = (Test-Path -LiteralPath $rm)
              videoUrl = $null   # populated later when published
            }
          }
        }
    }
  }

$manifest = [ordered]@{
  schema    = 1
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
$entries | Where-Object { -not $_.grade } | ForEach-Object { "  UNGRADED: $($_.path)" }
Write-Output "=== kind breakdown ==="
$entries | Group-Object kind | Select-Object Count, Name | Format-Table -AutoSize
Write-Output "=== interactive entries (embeddable) ==="
$entries | Where-Object { $_.entry } | ForEach-Object { "  $($_.path)  ->  $($_.entry)" }
