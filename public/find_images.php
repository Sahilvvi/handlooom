<?php
header('Content-Type: text/plain');
$base = realpath(__DIR__ . '/..');
echo "Searching everywhere using pure PHP in: $base\n";

function search($dir) {
    $files = @scandir($dir);
    if (!$files) return;
    foreach ($files as $f) {
        if ($f === '.' || $f === '..') continue;
        if ($f === 'node_modules') continue;
        $path = $dir . '/' . $f;
        if ($f === '1.png') echo "FOUND: " . $path . "\n";
        if (is_dir($path)) search($path);
    }
}
search($base);
echo "\nPure PHP Scan complete.";
?>
