# Renders public/og.png (1200x630 OG share banner) - matches the site's neural aesthetic.
# Run: powershell -NoProfile -ExecutionPolicy Bypass -File scripts\make-og.ps1
Add-Type -AssemblyName System.Drawing

$W = 1200; $H = 630
$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function New-Color([int]$r, [int]$gg, [int]$b, [int]$a) { [System.Drawing.Color]::FromArgb($a, $r, $gg, $b) }

# Radial glow helper (PathGradientBrush: center color fades to transparent)
function Add-Glow([float]$cx, [float]$cy, [float]$radius, [System.Drawing.Color]$color) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse([float]($cx - $radius), [float]($cy - $radius), [float](2 * $radius), [float](2 * $radius))
  $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
  $brush.CenterColor = $color
  $zeros = @(New-Color 0 0 0 0)
  $brush.SurroundColors = $zeros
  $brush.FocusScales = New-Object System.Drawing.PointF([float]0.62, [float]0.62)
  $script:g.FillEllipse($brush, [float]($cx - $radius), [float]($cy - $radius), [float](2 * $radius), [float](2 * $radius))
  $brush.Dispose(); $path.Dispose()
}

# ── Background ────────────────────────────────────────────────
$bgC = New-Color 5 6 10 255
$g.Clear($bgC)

Add-Glow 1010 90  380 (New-Color 34 211 238 36)   # cyan, top-right
Add-Glow 200  550 420 (New-Color 139 92 246 31)   # violet, bottom-left

# ── Neural particle field (same seeded PRNG as the hero) ─────
$seed = 1337
function Rnd { $script:seed = ($script:seed * 16807) % 2147483647; return ($script:seed - 1) / 2147483646.0 }

$pts = @()
for ($i = 0; $i -lt 70; $i++) {
  $x = (Rnd) * $W
  $y = (Rnd) * $H
  $r = 1 + (Rnd) * 2.2
  $isCyan = (Rnd) -gt 0.5
  $pts += ,@($x, $y, $r, $isCyan)
}

# synapse links
for ($i = 0; $i -lt $pts.Count; $i++) {
  for ($j = $i + 1; $j -lt $pts.Count; $j++) {
    $dx = $pts[$i][0] - $pts[$j][0]; $dy = $pts[$i][1] - $pts[$j][1]
    $d = [Math]::Sqrt($dx * $dx + $dy * $dy)
    if ($d -lt 150) {
      $alpha = [int]((1 - $d / 150) * 0.16 * 255)
      $lc = New-Color 90 150 220 $alpha
      $pen = New-Object System.Drawing.Pen($lc, 1)
      $g.DrawLine($pen, [float]$pts[$i][0], [float]$pts[$i][1], [float]$pts[$j][0], [float]$pts[$j][1])
      $pen.Dispose()
    }
  }
}
# particles
foreach ($p in $pts) {
  if ($p[3]) { $pc = New-Color 34 211 238 128 } else { $pc = New-Color 139 92 246 115 }
  $b = New-Object System.Drawing.SolidBrush($pc)
  $g.FillEllipse($b, [float]($p[0] - $p[2]), [float]($p[1] - $p[2]), [float](2 * $p[2]), [float](2 * $p[2]))
  $b.Dispose()
}

# ── Orbit ring, right side ───────────────────────────────────
$ringC = New-Color 34 211 238 46
$ringV = New-Color 139 92 246 56
$penC = New-Object System.Drawing.Pen($ringC, 1)
$penV = New-Object System.Drawing.Pen($ringV, 1)
$g.DrawEllipse($penC, 790.0, 165.0, 300.0, 300.0)   # outer r=150 @(940,315)
$g.DrawEllipse($penV, 832.0, 207.0, 216.0, 216.0)   # inner r=108
Add-Glow 940 315 60 (New-Color 120 190 242 110)     # soft core
$penC.Dispose(); $penV.Dispose()

# ── Gradient-text helper ─────────────────────────────────────
function Draw-GradientText([string]$text, [System.Drawing.Font]$font, [float]$x, [float]$y) {
  $size = $script:g.MeasureString($text, $font)
  $w = [int][Math]::Ceiling($size.Width) + 8
  $h = [int][Math]::Ceiling($size.Height) + 8
  $gradBmp = New-Object System.Drawing.Bitmap($w, $h)
  $gg = [System.Drawing.Graphics]::FromImage($gradBmp)
  $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
  $c1 = New-Color 34 211 238 255
  $c2 = New-Color 139 92 246 255
  $lin = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 0.0)
  $gg.FillRectangle($lin, $rect)
  $tex = New-Object System.Drawing.TextureBrush($gradBmp)
  $tex.TranslateTransform($x, $y)
  $script:g.DrawString($text, $font, $tex, $x, $y)
  $lin.Dispose(); $tex.Dispose(); $gg.Dispose(); $gradBmp.Dispose()
}

$sans  = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$huge  = New-Object System.Drawing.Font("Segoe UI", 94, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$role  = New-Object System.Drawing.Font("Segoe UI", 42, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$small = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$tiny  = New-Object System.Drawing.Font("Segoe UI", 19, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

Draw-GradientText "SV." $sans 90 108
Draw-GradientText "Siddharth" $huge 88 168
Draw-GradientText "Verma" $huge 88 268
Draw-GradientText "Full Stack + Gen AI Developer" $role 90 380

$tagC = New-Color 255 255 255 107
$tagBrush = New-Object System.Drawing.SolidBrush($tagC)
$g.DrawString("I use AI to eliminate the repetitive, so I can engineer what truly", $small, $tagBrush, 90.0, 452.0)
$g.DrawString("matters - scalable, intelligent systems.", $small, $tagBrush, 90.0, 485.0)
$tagBrush.Dispose()

# bottom badge
Add-Glow 96 566 14 (New-Color 34 211 238 150)
$dotC = New-Color 34 211 238 220
$dot = New-Object System.Drawing.SolidBrush($dotC)
$g.FillEllipse($dot, 91.0, 561.0, 10.0, 10.0)
$dot.Dispose()
$botC = New-Color 255 255 255 89
$botBrush = New-Object System.Drawing.SolidBrush($botC)
$g.DrawString("Building intelligent systems  -  Available for opportunities", $tiny, $botBrush, 116.0, 556.0)
$botBrush.Dispose()

# ── Save ─────────────────────────────────────────────────────
$out = Join-Path $PSScriptRoot "..\public\og.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
$sans.Dispose(); $huge.Dispose(); $role.Dispose(); $small.Dispose(); $tiny.Dispose()
"og.png written: $([math]::Round((Get-Item $out).Length/1KB,0)) KB, ${W}x${H}"
