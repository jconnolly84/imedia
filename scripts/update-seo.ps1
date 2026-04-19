$ErrorActionPreference = "Stop"

$siteName = "iMedia Genius"
$baseUrl = "https://imediagenius.co.uk"
$today = Get-Date -Format "yyyy-MM-dd"

$noIndexPages = @(
  "markable-mini-exam-marking-desk.html",
  "marking-desk-jun2025.html"
)

$examPages = @(
  "01-mini-exam.html",
  "markable-mini-exam.html",
  "r093-jun2025-exam.html",
  "nine-mark-ai-trainer.html",
  "nine-mark-ninja.html",
  "nine-marker-arena.html",
  "escape-room-r093.html",
  "exam-styles-showdown.html"
)

$internalPages = @(
  "markable-mini-exam-marking-desk.html",
  "marking-desk-jun2025.html"
)

function Normalize-Whitespace {
  param([string]$Value)
  if (-not $Value) { return "" }
  return (($Value -replace "\s+", " ").Trim())
}

function Repair-Text {
  param([string]$Value)
  if (-not $Value) { return "" }

  $fixed = $Value
  $markers = @([char]0x00C3, [char]0x00C2, [char]0x00E2)
  $needsRepair = $false

  foreach ($marker in $markers) {
    if ($fixed.Contains([string]$marker)) {
      $needsRepair = $true
      break
    }
  }

  if ($needsRepair) {
    try {
      $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($fixed)
      $candidate = [System.Text.Encoding]::UTF8.GetString($bytes)
      if ($candidate -and -not $candidate.Contains([string][char]0xFFFD)) {
        $fixed = $candidate
      }
    } catch {
      $fixed = $Value
    }
  }

  return $fixed
}

function Strip-Html {
  param([string]$Value)
  if (-not $Value) { return "" }
  $decoded = [System.Net.WebUtility]::HtmlDecode($Value)
  $plain = $decoded -replace "<[^>]+>", " "
  $plain = $plain -replace "[\u00A0]", " "
  $plain = Repair-Text $plain
  return (Normalize-Whitespace $plain)
}

function Get-FirstHeading {
  param([string]$Html, [string]$Fallback)
  $match = [regex]::Match($Html, '(?is)<h1[^>]*>(.*?)</h1>')
  if ($match.Success) {
    $heading = Strip-Html $match.Groups[1].Value
    if ($heading) { return $heading }
  }
  return $Fallback
}

function Slug-To-Title {
  param([string]$FileName)
  $slug = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $slug = $slug -replace '^\d+-', ''
  $slug = $slug -replace '^topic-\d+-', ''
  $slug = $slug -replace '^r093-', 'R093 '
  $slug = $slug -replace '-', ' '
  $slug = [System.Globalization.CultureInfo]::InvariantCulture.TextInfo.ToTitleCase($slug.ToLowerInvariant())
  $slug = $slug -replace '\bImedia\b', 'iMedia'
  $slug = $slug -replace '\bR093\b', 'R093'
  $slug = $slug -replace '\bSfx\b', 'SFX'
  $slug = $slug -replace '\bVfx\b', 'VFX'
  $slug = $slug -replace '\bIpr\b', 'IPR'
  $slug = $slug -replace '\bAi\b', 'AI'
  return (Normalize-Whitespace $slug)
}

function Get-ImageUrl {
  param([string]$FileName)
  if ($FileName -eq "index.html") {
    return "$baseUrl/img/index-hero.png"
  }

  $stem = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
  $candidates = @(
    "img/$stem-hero.png",
    "img/$stem-hero.jpg",
    "img/$stem-hero.jpeg",
    "img/$stem-hero.webp",
    "img/$stem-hero.gif"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return "$baseUrl/$candidate"
    }
  }

  return "$baseUrl/img/index-hero.png"
}

function Build-Schema {
  param(
    [string]$SchemaType,
    [string]$Title,
    [string]$Description,
    [string]$Canonical
  )

  $schema = [ordered]@{
    "@context" = "https://schema.org"
    "@type" = $SchemaType
    name = $Title
    description = $Description
    url = $Canonical
    inLanguage = "en-GB"
    isPartOf = @{
      "@type" = "WebSite"
      name = $siteName
      url = $baseUrl
    }
    about = @(
      "OCR Creative iMedia",
      "R093",
      "Creative iMedia in the Media Industry",
      "iMedia revision"
    )
  }

  return ($schema | ConvertTo-Json -Depth 6 -Compress)
}

function Get-PageMeta {
  param([string]$FileName, [string]$Html)

  $fallbackTitle = Slug-To-Title $FileName
  $heading = Get-FirstHeading -Html $Html -Fallback $fallbackTitle
  $heading = Normalize-Whitespace (Repair-Text $heading)

  $canonical = if ($FileName -eq "index.html") { "$baseUrl/" } else { "$baseUrl/$FileName" }
  $imageUrl = Get-ImageUrl $FileName
  $robots = if ($noIndexPages -contains $FileName) {
    "noindex, nofollow, noarchive"
  } else {
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  }

  if ($FileName -eq "index.html") {
    return [ordered]@{
      Title = "OCR Creative iMedia Revision | R093 Revision, Games & Exam Practice | $siteName"
      Description = "The home of OCR Creative iMedia revision for R093: topic guides, revision games, flashcards, videos, podcasts and exam practice for Creative iMedia in the Media Industry."
      Canonical = $canonical
      ImageUrl = $imageUrl
      ImageAlt = "iMedia Genius homepage for OCR Creative iMedia R093 revision"
      Robots = $robots
      SchemaType = "CollectionPage"
    }
  }

  if ($FileName -like "topic-*.html") {
    $topic = Slug-To-Title $FileName
    return [ordered]@{
      Title = "$topic Revision | OCR Creative iMedia R093 | $siteName"
      Description = "Revise $topic for OCR Creative iMedia R093 with clear notes, examples, video, podcast, flashcards, practice questions and revision games."
      Canonical = $canonical
      ImageUrl = $imageUrl
      ImageAlt = "$topic revision guide for OCR Creative iMedia R093"
      Robots = $robots
      SchemaType = "LearningResource"
    }
  }

  switch ($FileName) {
    "r093-jun2025-exam.html" {
      return [ordered]@{
        Title = "R093 June 2025 Exam Practice | OCR Creative iMedia Mock Exam | $siteName"
        Description = "Practise the OCR Creative iMedia R093 exam with a full June 2025 style paper, timed conditions and markable answers for Creative iMedia in the Media Industry."
        Canonical = $canonical
        ImageUrl = $imageUrl
        ImageAlt = "OCR Creative iMedia R093 exam practice page"
        Robots = $robots
        SchemaType = "LearningResource"
      }
    }
    "01-mini-exam.html" {
      return [ordered]@{
        Title = "R093 Mini Exam | OCR Creative iMedia Exam Practice | $siteName"
        Description = "Test your OCR Creative iMedia R093 knowledge with a focused mini exam built for revision, retrieval practice and exam confidence."
        Canonical = $canonical
        ImageUrl = $imageUrl
        ImageAlt = "OCR Creative iMedia R093 mini exam practice page"
        Robots = $robots
        SchemaType = "LearningResource"
      }
    }
    "markable-mini-exam.html" {
      return [ordered]@{
        Title = "Markable R093 Mini Exam | OCR Creative iMedia Practice | $siteName"
        Description = "Complete a markable OCR Creative iMedia R093 mini exam with exam-style questions and structured practice on iMedia Genius."
        Canonical = $canonical
        ImageUrl = $imageUrl
        ImageAlt = "Markable OCR Creative iMedia R093 mini exam"
        Robots = $robots
        SchemaType = "LearningResource"
      }
    }
    "escape-room-r093.html" {
      return [ordered]@{
        Title = "Escape Room R093 | OCR Creative iMedia Revision Game | $siteName"
        Description = "Revise OCR Creative iMedia R093 through an interactive escape room packed with retrieval practice for Creative iMedia in the Media Industry."
        Canonical = $canonical
        ImageUrl = $imageUrl
        ImageAlt = "Escape Room R093 revision game for OCR Creative iMedia"
        Robots = $robots
        SchemaType = "LearningResource"
      }
    }
    "nine-mark-ai-trainer.html" {
      return [ordered]@{
        Title = "9-Mark AI Trainer | OCR Creative iMedia R093 Revision | $siteName"
        Description = "Improve extended responses for OCR Creative iMedia R093 with AI-ready 9-mark practice, feedback prompts and exam technique support."
        Canonical = $canonical
        ImageUrl = $imageUrl
        ImageAlt = "9-Mark AI Trainer for OCR Creative iMedia R093"
        Robots = $robots
        SchemaType = "LearningResource"
      }
    }
  }

  if ($examPages -contains $FileName) {
    return [ordered]@{
      Title = "$heading | OCR Creative iMedia R093 Exam Practice | $siteName"
      Description = "Build exam confidence for OCR Creative iMedia R093 with $heading on iMedia Genius, including exam-style revision and practice."
      Canonical = $canonical
      ImageUrl = $imageUrl
      ImageAlt = "$heading for OCR Creative iMedia R093"
      Robots = $robots
      SchemaType = "LearningResource"
    }
  }

  return [ordered]@{
    Title = "$heading | OCR Creative iMedia R093 Revision | $siteName"
    Description = "Revise OCR Creative iMedia R093 with $heading on iMedia Genius, including interactive practice for Creative iMedia in the Media Industry."
    Canonical = $canonical
    ImageUrl = $imageUrl
    ImageAlt = "$heading revision page for OCR Creative iMedia R093"
    Robots = $robots
    SchemaType = "LearningResource"
  }
}

function Update-HtmlMeta {
  param([string]$Path)

  $fileName = [System.IO.Path]::GetFileName($Path)
  $html = Get-Content -LiteralPath $Path -Raw
  $meta = Get-PageMeta -FileName $fileName -Html $html
  $schemaJson = Build-Schema -SchemaType $meta.SchemaType -Title $meta.Title -Description $meta.Description -Canonical $meta.Canonical

  $patterns = @(
    '(?is)<title>.*?</title>\s*',
    '(?is)<meta\s+[^>]*name=["'']description["''][^>]*>\s*',
    '(?is)<meta\s+[^>]*name=["'']robots["''][^>]*>\s*',
    '(?is)<meta\s+[^>]*property=["'']og:[^"'']+["''][^>]*>\s*',
    '(?is)<meta\s+[^>]*name=["'']twitter:[^"'']+["''][^>]*>\s*',
    '(?is)<link\s+[^>]*rel=["'']canonical["''][^>]*>\s*',
    '(?is)<script\s+type=["'']application/ld\+json["'']>.*?</script>\s*'
  )

  foreach ($pattern in $patterns) {
    $html = [regex]::Replace($html, $pattern, '')
  }

  $metadataBlock = @"
<title>$($meta.Title)</title>
<meta name="description" content="$($meta.Description)"/>
<meta name="robots" content="$($meta.Robots)"/>
<link rel="canonical" href="$($meta.Canonical)"/>
<meta property="og:locale" content="en_GB"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="$siteName"/>
<meta property="og:url" content="$($meta.Canonical)"/>
<meta property="og:title" content="$($meta.Title)"/>
<meta property="og:description" content="$($meta.Description)"/>
<meta property="og:image" content="$($meta.ImageUrl)"/>
<meta property="og:image:alt" content="$($meta.ImageAlt)"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="$($meta.Title)"/>
<meta name="twitter:description" content="$($meta.Description)"/>
<meta name="twitter:image" content="$($meta.ImageUrl)"/>
<script type="application/ld+json">$schemaJson</script>
"@

  if ([regex]::IsMatch($html, '(?is)<meta\s+[^>]*name=["'']viewport["''][^>]*>\s*')) {
    $html = [regex]::Replace(
      $html,
      '(?is)(<meta\s+[^>]*name=["'']viewport["''][^>]*>\s*)',
      "`$1$metadataBlock",
      1
    )
  } elseif ([regex]::IsMatch($html, '(?is)<meta\s+charset=["''][^"'']+["'']\s*/?>\s*')) {
    $html = [regex]::Replace(
      $html,
      '(?is)(<meta\s+charset=["''][^"'']+["'']\s*/?>\s*)',
      "`$1$metadataBlock",
      1
    )
  } else {
    $html = [regex]::Replace($html, '(?is)(<head>\s*)', "`$1$metadataBlock", 1)
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $Path), $html, $utf8NoBom)
}

function Get-SitemapPriority {
  param([string]$FileName)
  if ($FileName -eq "index.html") { return "1.0" }
  if ($FileName -like "topic-*.html") { return "0.9" }
  if ($examPages -contains $FileName) { return "0.85" }
  return "0.7"
}

$htmlFiles = Get-ChildItem -LiteralPath . -File -Filter *.html | Sort-Object Name

foreach ($file in $htmlFiles) {
  Update-HtmlMeta -Path $file.FullName
}

$sitemapEntries = foreach ($file in $htmlFiles) {
  if ($internalPages -contains $file.Name) { continue }

  $loc = if ($file.Name -eq "index.html") {
    "$baseUrl/"
  } else {
    "$baseUrl/$($file.Name)"
  }

  [PSCustomObject]@{
    loc = $loc
    priority = Get-SitemapPriority -FileName $file.Name
  }
}

$xml = New-Object System.Xml.XmlDocument
$declaration = $xml.CreateXmlDeclaration("1.0", "utf-8", $null)
$xml.AppendChild($declaration) | Out-Null
$urlset = $xml.CreateElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9")
$xml.AppendChild($urlset) | Out-Null

foreach ($entry in $sitemapEntries) {
  $urlNode = $xml.CreateElement("url", $urlset.NamespaceURI)

  foreach ($field in @("loc", "lastmod", "changefreq", "priority")) {
    $node = $xml.CreateElement($field, $urlset.NamespaceURI)
    switch ($field) {
      "loc" { $node.InnerText = $entry.loc }
      "lastmod" { $node.InnerText = $today }
      "changefreq" { $node.InnerText = "weekly" }
      "priority" { $node.InnerText = $entry.priority }
    }
    $urlNode.AppendChild($node) | Out-Null
  }

  $urlset.AppendChild($urlNode) | Out-Null
}

$xml.Save((Join-Path (Get-Location) "sitemap.xml"))

$robots = @"
User-agent: *
Allow: /

Host: imediagenius.co.uk
Sitemap: $baseUrl/sitemap.xml
"@

[System.IO.File]::WriteAllText((Join-Path (Get-Location) "robots.txt"), $robots, (New-Object System.Text.UTF8Encoding($false)))
