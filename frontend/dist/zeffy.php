<?php
// Set timezone to Toronto
date_default_timezone_set('America/Toronto');

// File to store clicks and timestamps
$logFile = 'clicks.txt';

// Determine current click number
$count = 0;
if(file_exists($logFile)) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $count = count($lines);
}
$count++; // this is the new click number

// Get current timestamp
$timestamp = date("Y-m-d H:i:s");

// Prepare line: Click#, Timestamp, IP
$logLine = "$count, $timestamp\n";

// Append line to file
file_put_contents($logFile, $logLine, FILE_APPEND);

// Redirect to Zeffy
header("Location: https://www.zeffy.com/en-CA/ticketing/university-of-toronto-high-school-design-competition-2t5", true, 302);
exit();
?>
