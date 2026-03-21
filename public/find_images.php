<?php
header('Content-Type: text/plain');
$base = realpath(__DIR__ . '/..');
echo "Searching everywhere using shell (if permitted) in: $base\n";

$result = shell_exec("find " . escapeshellarg($base) . " -name '1.png' 2>/dev/null");
echo $result ? $result : "shell_exec failed or not found.\n";

if (!$result) {
    echo "Falling back to PHP recursive search (unlimited depth):\n";
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
}
?>
